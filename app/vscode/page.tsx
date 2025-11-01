"use client";

import { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { EditorView } from "@codemirror/view";

type FileNode = {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
};

type ValidationError = {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning";
};

export default function VsCodePage() {
  const [isClient, setIsClient] = useState(false);
  const [structure, setStructure] = useState<FileNode[] | null>(null);
  const [showExplorer, setShowExplorer] = useState(true);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupValue, setPopupValue] = useState("");
  const [popupAction, setPopupAction] = useState<null | (() => void)>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  // 🔹 FIX: Initialize structure dengan function wrapper
  useEffect(() => {
    const initializeStructure = () => {
      setIsClient(true);
      
      const saved = localStorage.getItem("vscode-structure");
      if (saved) {
        setStructure(JSON.parse(saved));
      } else {
        setStructure([
          { 
            name: "index.html", 
            type: "file", 
            content: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="src/style.css">
</head>
<body>
    <h1>Hello World</h1>
    <script src="src/script.js"></script>
</body>
</html>` 
          },
          {
            name: "src",
            type: "folder",
            children: [
              { name: "style.css", type: "file", content: "body { color: blue; }" },
              { name: "script.js", type: "file", content: "console.log('Hi');" },
            ],
          },
        ]);
      }
    };

    initializeStructure();
  }, []);

  // Save structure to localStorage
  useEffect(() => {
    if (structure && isClient) {
      localStorage.setItem("vscode-structure", JSON.stringify(structure));
    }
  }, [structure, isClient]);

  // 🔹 Fungsi untuk mendapatkan semua file dalam struktur
  const getAllFiles = (): Record<string, string> => {
    const allFiles: Record<string, string> = {};

    const gatherFiles = (nodes: FileNode[], path = "") => {
      nodes.forEach((n) => {
        const fullPath = path ? `${path}/${n.name}` : n.name;
        if (n.type === "file" && n.content !== undefined) allFiles[fullPath] = n.content;
        if (n.type === "folder" && n.children) gatherFiles(n.children, fullPath);
      });
    };
    
    if (structure) gatherFiles(structure);
    return allFiles;
  };

  // 🔹 Validasi HTML yang lebih akurat
  const validateHTML = (htmlContent: string, filename: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    const lines = htmlContent.split('\n');
    
    // Self-closing tags yang tidak perlu tag penutup
    const selfClosingTags = ['meta', 'link', 'img', 'br', 'hr', 'input', '!doctype'];

    const tagStack: { tag: string, line: number, column: number }[] = [];
    
    lines.forEach((line, lineIndex) => {
      // Cari semua tag di line ini
      const tags = line.match(/<[^>]+>/g) || [];
      
      tags.forEach(tag => {
        const tagMatch = tag.match(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)/);
        if (!tagMatch) return;
        
        const isClosing = tagMatch[1] === '/';
        const tagName = tagMatch[2].toLowerCase();
        const column = line.indexOf(tag) + 1;
        
        if (isClosing) {
          // Tag penutup
          const lastOpenTag = tagStack[tagStack.length - 1];
          if (lastOpenTag && lastOpenTag.tag === tagName) {
            tagStack.pop();
          } else {
            errors.push({
              file: filename,
              line: lineIndex + 1,
              column,
              message: `Tag penutup </${tagName}> tanpa tag pembuka`,
              severity: "error"
            });
          }
        } else if (!tag.endsWith('/>') && !selfClosingTags.includes(tagName)) {
          // Tag pembuka (bukan self-closing)
          tagStack.push({ tag: tagName, line: lineIndex + 1, column });
        }
      });
    });

    // Tag yang tidak ditutup
    tagStack.forEach(({ tag, line, column }) => {
      errors.push({
        file: filename,
        line,
        column,
        message: `Tag <${tag}> tidak ditutup`,
        severity: "error"
      });
    });

    // Validasi attribute quotes
    lines.forEach((line, lineIndex) => {
      const unquotedAttrs = line.match(/<[^>]*=\s*[^"'\s>][^>\s]*/g);
      if (unquotedAttrs) {
        unquotedAttrs.forEach(match => {
          if (!match.includes('"') && !match.includes("'") && match.includes('=')) {
            errors.push({
              file: filename,
              line: lineIndex + 1,
              column: line.indexOf(match) + 1,
              message: "Attribute harus menggunakan quotes",
              severity: "error"
            });
          }
        });
      }
    });

    // Validasi href/src yang tidak ada file-nya (hanya warning)
    const allFiles = getAllFiles();
    const fileNames = Object.keys(allFiles);
    
    lines.forEach((line, lineIndex) => {
      // Cek href untuk link CSS
      const hrefMatches = line.match(/href=["']([^"']*)["']/g) || [];
      hrefMatches.forEach(href => {
        const hrefValue = href.match(/href=["']([^"']*)["']/)?.[1];
        if (hrefValue && !hrefValue.startsWith('http') && !hrefValue.startsWith('#') && !hrefValue.startsWith('mailto:')) {
          const normalizedPath = hrefValue.startsWith('/') ? hrefValue.substring(1) : hrefValue;
          const fileExists = fileNames.some(file => 
            file === normalizedPath || file.endsWith('/' + normalizedPath)
          );
          
          if (!fileExists) {
            errors.push({
              file: filename,
              line: lineIndex + 1,
              column: line.indexOf(href) + 1,
              message: `File tidak ditemukan: "${hrefValue}"`,
              severity: "warning"
            });
          }
        }
      });

      // Cek src untuk script
      const srcMatches = line.match(/src=["']([^"']*)["']/g) || [];
      srcMatches.forEach(src => {
        const srcValue = src.match(/src=["']([^"']*)["']/)?.[1];
        if (srcValue && !srcValue.startsWith('http') && !srcValue.startsWith('//')) {
          const normalizedPath = srcValue.startsWith('/') ? srcValue.substring(1) : srcValue;
          const fileExists = fileNames.some(file => 
            file === normalizedPath || file.endsWith('/' + normalizedPath)
          );
          
          if (!fileExists) {
            errors.push({
              file: filename,
              line: lineIndex + 1,
              column: line.indexOf(src) + 1,
              message: `File tidak ditemukan: "${srcValue}"`,
              severity: "warning"
            });
          }
        }
      });
    });

    return errors;
  };

  // 🔹 FUNGSI SCROLL TO ERROR YANG DIPERBAIKI
  const scrollToError = (line: number, column: number) => {
    if (!editorRef.current) {
      console.warn('Editor ref tidak tersedia');
      return;
    }

    try {
      // Method: Gunakan DOM langsung (paling reliable)
      const editorElement = document.querySelector('.cm-editor');
      if (editorElement) {
        const lineElements = editorElement.querySelectorAll('.cm-line');
        if (lineElements[line - 1]) {
          const lineElement = lineElements[line - 1] as HTMLElement;
          
          // Scroll ke line
          lineElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Highlight sementara
          const originalBg = lineElement.style.backgroundColor;
          lineElement.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
          lineElement.style.transition = 'background-color 0.3s ease';
          
          setTimeout(() => {
            lineElement.style.backgroundColor = originalBg;
          }, 2000);
        }
      }
    } catch (error) {
      console.warn('Error scrolling to line:', error);
    }
  };

  // 🔹 Fungsi untuk handle run
  const handleRun = () => {
    if (!structure || !activeFile) return;

    setValidationErrors([]);

    if (!activeFile.name.endsWith('.html')) {
      setValidationErrors([{
        file: activeFile.name,
        line: 1,
        column: 1,
        message: "Run hanya bisa dijalankan dari file HTML",
        severity: "error"
      }]);
      return;
    }

    console.log(`🔍 Validating HTML: ${activeFile.name}`);
    const htmlErrors = validateHTML(activeFile.content || "", activeFile.name);
    setValidationErrors(htmlErrors);

    const hasErrors = htmlErrors.some(error => error.severity === "error");
    
    if (hasErrors) {
      console.log("❌ Errors found, stopping preview");
      return;
    }

    console.log("✅ Generating preview...");
    
    const allFiles = getAllFiles();
    const htmlFile = Object.entries(allFiles).find(([k]) => k.endsWith(".html"));
    
    if (htmlFile) {
      const [, htmlContent] = htmlFile; // 🔹 FIX: Gunakan underscore untuk variable tidak terpakai
      
      // Extract CSS dan JS dari HTML untuk preview
      const cssLinks = htmlContent.match(/<link[^>]*href=["']([^"']*)["'][^>]*>/g) || [];
      const cssHrefs = cssLinks.map(link => {
        const match = link.match(/href=["']([^"']*)["']/);
        return match ? match[1] : null;
      }).filter(Boolean) as string[];

      const scriptTags = htmlContent.match(/<script[^>]*src=["']([^"']*)["'][^>]*>/g) || [];
      const scriptSrcs = scriptTags.map(script => {
        const match = script.match(/src=["']([^"']*)["']/);
        return match ? match[1] : null;
      }).filter(Boolean) as string[];

      // Gabungkan semua CSS
      let combinedCSS = '';
      cssHrefs.forEach(cssHref => {
        const normalizedPath = cssHref.startsWith('/') ? cssHref.substring(1) : cssHref;
        const cssFile = Object.entries(allFiles).find(([filepath]) => 
          filepath === normalizedPath || filepath.endsWith('/' + normalizedPath)
        );
        if (cssFile) {
          combinedCSS += `/* ${cssFile[0]} */\n${cssFile[1]}\n\n`;
        }
      });

      // Gabungkan semua JS
      let combinedJS = '';
      scriptSrcs.forEach(scriptSrc => {
        const normalizedPath = scriptSrc.startsWith('/') ? scriptSrc.substring(1) : scriptSrc;
        const jsFile = Object.entries(allFiles).find(([filepath]) => 
          filepath === normalizedPath || filepath.endsWith('/' + normalizedPath)
        );
        if (jsFile) {
          combinedJS += `/* ${jsFile[0]} */\n${jsFile[1]}\n\n`;
        }
      });

      const blob = new Blob(
        [
          `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${combinedCSS}</style>
</head>
<body>
  ${htmlContent.replace(/<script[^>]*src=["'][^"']*["'][^>]*><\/script>/g, '')}
  <div id="error-console" style="background:#111;color:#ff6b6b;font-family:monospace;padding:8px;white-space:pre;font-size:13px;display:none;"></div>
  <script>
    const errorConsole = document.getElementById('error-console');
    window.onerror = (msg, src, line, col, err) => {
      errorConsole.style.display = 'block';
      errorConsole.innerText = '❌ JavaScript Error: ' + msg + '\\n at ' + src + ':' + line + ':' + col;
    };
    try { 
      ${combinedJS} 
    } catch(e) { 
      errorConsole.style.display = 'block';
      errorConsole.innerText = '❌ JavaScript Error: ' + e.message; 
    }
  </script>
</body>
</html>`,
        ],
        { type: "text/html" }
      );

      const newUrl = URL.createObjectURL(blob);
      setPreviewSrc(newUrl);
      if (iframeRef.current) {
        iframeRef.current.src = newUrl;
      }
      
      setTimeout(() => {
        URL.revokeObjectURL(newUrl);
      }, 1000);
    }
  };

  // 🔹 Fungsi untuk render error dengan format VS Code-like
  const renderValidationErrors = () => {
    if (validationErrors.length === 0) return null;

    const errors = validationErrors.filter(e => e.severity === "error");
    const warnings = validationErrors.filter(e => e.severity === "warning");

    return (
      <div className="space-y-2">
        {errors.length > 0 && (
          <div className="bg-red-900/40 border border-red-600/40 rounded-md p-3">
            <div className="font-bold text-red-400 mb-2 flex items-center">
              ⚠️ {errors.length} Error{errors.length > 1 ? 's' : ''}
            </div>
            <div className="space-y-1 text-xs font-mono max-h-32 overflow-y-auto">
              {errors.map((error, index) => (
                <div 
                  key={index} 
                  className="flex items-start hover:bg-red-800/30 px-2 py-1 rounded cursor-pointer"
                  onClick={() => scrollToError(error.line, error.column)}
                >
                  <span className="text-red-400 mr-2">●</span>
                  <div>
                    <span className="text-red-300">
                      {error.file}:{error.line}:{error.column}
                    </span>
                    <span className="text-red-200 ml-2">{error.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="bg-yellow-900/40 border border-yellow-600/40 rounded-md p-3">
            <div className="font-bold text-yellow-400 mb-2 flex items-center">
              ⚠️ {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
            </div>
            <div className="space-y-1 text-xs font-mono max-h-32 overflow-y-auto">
              {warnings.map((warning, index) => (
                <div 
                  key={index} 
                  className="flex items-start hover:bg-yellow-800/30 px-2 py-1 rounded cursor-pointer"
                  onClick={() => scrollToError(warning.line, warning.column)}
                >
                  <span className="text-yellow-400 mr-2">⚠</span>
                  <div>
                    <span className="text-yellow-300">
                      {warning.file}:{warning.line}:{warning.column}
                    </span>
                    <span className="text-yellow-200 ml-2">{warning.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 🔹 Update file content function
  const updateFileContent = (value: string) => {
    if (!structure || !activeFile) return;

    const updateNode = (nodes: FileNode[]): FileNode[] =>
      nodes.map((n) => {
        if (n.type === "file" && n.name === activeFile.name)
          return { ...n, content: value };
        if (n.type === "folder" && n.children)
          return { ...n, children: updateNode(n.children) };
        return n;
      });

    setStructure(updateNode(structure));
    setActiveFile({ ...activeFile, content: value });
  };

  // 🔹 Fungsi-fungsi lainnya tetap sama (addNode, deleteNode, exportZip, renderTree)
  const openPopup = (
    title: string,
    placeholder: string,
    onConfirm: (val: string) => void
  ) => {
    setPopupTitle(title);
    setPopupValue("");
    setShowPopup(true);
    setPopupAction(() => () => {
      const inputEl = document.getElementById("popup-input") as HTMLInputElement;
      const value = inputEl?.value.trim();
      if (value) onConfirm(value);
      setShowPopup(false);
    });
  };

  const addNode = (type: "file" | "folder", parentPath: string[] = []) => {
    if (!structure) return;
    openPopup(
      `Buat ${type === "file" ? "File" : "Folder"} Baru`,
      "nama...",
      (name) => {
        const newNode: FileNode =
          type === "file"
            ? { name, type, content: "" }
            : { name, type, children: [] };

        const addTo = (nodes: FileNode[], path: string[]): FileNode[] => {
          if (path.length === 0) return [...nodes, newNode];
          return nodes.map((n) => {
            if (n.type === "folder" && n.name === path[0])
              return { ...n, children: addTo(n.children || [], path.slice(1)) };
            return n;
          });
        };

        setStructure(addTo(structure!, parentPath));
      }
    );
  };

  const deleteNode = (targetName: string) => {
    if (!structure) return;
    const remove = (nodes: FileNode[]): FileNode[] =>
      nodes
        .filter((n) => n.name !== targetName)
        .map((n) =>
          n.type === "folder" && n.children
            ? { ...n, children: remove(n.children) }
            : n
        );
    setStructure(remove(structure));
    if (activeFile?.name === targetName) setActiveFile(null);
  };

  const exportZip = async () => {
    if (!structure) return;
    
    const zip = new JSZip();

    const addToZip = (nodes: FileNode[], path = "") => {
      nodes.forEach((n) => {
        const fullPath = path ? `${path}/${n.name}` : n.name;
        if (n.type === "file") zip.file(fullPath, n.content || "");
        if (n.type === "folder" && n.children) addToZip(n.children, fullPath);
      });
    };
    addToZip(structure);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "project.zip");
  };

  const renderTree = (nodes: FileNode[], parentPath: string[] = []) => {
    if (!nodes) return null;

    return nodes.map((node, index) => {
      const renameNode = () => {
        openPopup("Rename File / Folder", node.name, (newName) => {
          const updateNode = (items: FileNode[]): FileNode[] =>
            items.map((n) => {
              if (n === node) return { ...n, name: newName };
              if (n.type === "folder" && n.children)
                return { ...n, children: updateNode(n.children) };
              return n;
            });
          setStructure(updateNode(structure!));
        });
      };

      const getIcon = () => {
        if (node.type === "folder") return "📁";
        if (node.name.endsWith(".html")) return "🌐";
        if (node.name.endsWith(".css")) return "🎨";
        if (node.name.endsWith(".js")) return "⚙️";
        return "📄";
      };

      return (
        <div key={index} className="ml-2">
          {node.type === "file" ? (
            <div
              className={`flex items-center justify-between cursor-pointer p-1 rounded ${
                activeFile?.name === node.name
                  ? "bg-purple-700/40"
                  : "hover:bg-purple-800/30"
              }`}
              onClick={() => setActiveFile(node)}
            >
              <span>
                {getIcon()} {node.name}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    renameNode();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✏️
                </button>
                <button
                  className="text-red-400 text-xs hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.name);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between font-semibold text-gray-300">
                <span>
                  {getIcon()} {node.name}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      renameNode();
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ✏️
                  </button>
                  <button
                    className="text-green-400 text-xs hover:text-green-500"
                    onClick={() => addNode("file", [...parentPath, node.name])}
                  >
                    +F
                  </button>
                  <button
                    className="text-yellow-400 text-xs hover:text-yellow-500"
                    onClick={() => addNode("folder", [...parentPath, node.name])}
                  >
                    +D
                  </button>
                  <button
                    className="text-red-400 text-xs hover:text-red-500"
                    onClick={() => deleteNode(node.name)}
                  >
                    ✕
                </button>
                </div>
              </div>
              <div className="ml-3">
                {renderTree(node.children || [], [...parentPath, node.name])}
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  // Early return setelah semua Hook
  if (!isClient) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#1e1e1e] text-purple-300">
        ⏳ Loading...
      </main>
    );
  }

  if (!structure) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#1e1e1e] text-purple-300">
        ⏳ Memuat struktur proyek...
      </main>
    );
  }

  return (
    <main className="pt-4 pb-10 min-h-screen bg-[#1e1e1e] text-white overflow-hidden">
      <div className="flex justify-between items-center px-4 mb-3 md:hidden">
        <button
          onClick={() => setShowExplorer(!showExplorer)}
          className="bg-purple-700 text-white px-3 py-1 rounded-lg text-sm shadow hover:bg-purple-600 transition"
        >
          {showExplorer ? "Tutup Explorer" : "Buka Explorer"}
        </button>
      </div>

      {showExplorer && (
        <div
          onClick={() => setShowExplorer(false)}
          className="fixed inset-0 bg-black/50 md:hidden z-10"
        ></div>
      )}

      <div className="relative flex flex-col md:flex-row w-full h-[78vh] md:h-[82vh] rounded-t-2xl border border-purple-500/20 shadow-xl overflow-hidden">
        {showExplorer && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 md:static md:relative 
            z-30 w-[240px] h-[78vh] bg-[#161616] border-r border-purple-500/20 
            p-3 overflow-y-auto rounded-l-2xl md:rounded-none shadow-xl"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm text-purple-300 font-semibold">EXPLORER</h2>
              <div className="flex gap-1">
                <button
                  className="text-green-400 text-xs hover:text-green-600"
                  onClick={() => addNode("file")}
                >
                  +FILE
                </button>
                <button
                  className="text-yellow-400 text-xs hover:text-yellow-600"
                  onClick={() => addNode("folder")}
                >
                  +FOLDER
                </button>
                <button
                  className="text-blue-400 text-xs hover:text-blue-600"
                  onClick={exportZip}
                >
                  🗜
                </button>
              </div>
            </div>
            <div className="pr-2">{renderTree(structure)}</div>
          </div>
        )}

        <div className="flex-1 flex flex-col bg-[#1e1e1e] h-full">
          {/* Error + Run bar */}
          <div className="flex flex-col">
            {renderValidationErrors()}

            <div className="flex justify-between items-center bg-[#2d2d2d] p-2 text-sm text-gray-400 border-b border-purple-600/20">
              <span>{activeFile ? activeFile.name : "No file selected"}</span>
              <button
                onClick={handleRun}
                className={`px-3 py-1 rounded-md text-xs transition ${
                  activeFile?.name.endsWith('.html') 
                    ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white hover:from-purple-600 hover:to-indigo-600"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!structure || !activeFile?.name.endsWith('.html')}
              >
                {activeFile?.name.endsWith('.html') ? "▶️ Run & Validate" : "⏸️ Select HTML File"}
              </button>
            </div>
          </div>

          {/* CodeMirror editor */}
          <div className="flex-1 overflow-auto">
            {activeFile && activeFile.type === "file" ? (
              <CodeMirror
                ref={editorRef}
                value={activeFile.content || ""}
                height="100%"
                theme={vscodeDark}
                extensions={
                  activeFile.name.endsWith(".html")
                    ? [html()]
                    : activeFile.name.endsWith(".css")
                    ? [css()]
                    : [javascript()]
                }
                onChange={updateFileContent}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLine: true,
                  highlightSelectionMatches: true,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a file to edit
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative my-6">
        <div className="h-1 bg-gradient-to-r from-purple-900 via-transparent to-indigo-900 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-4 py-1 text-sm md:text-base font-semibold bg-[#ff00d0] text-purple-300 rounded-full border border-purple-500/30 shadow-md animate-pulse">
            ⬇️ Output Dibawah ⬇️
          </span>
        </div>
      </div>

      <div className="w-full border border-purple-800/40 bg-gradient-to-b from-[#1e1e1e] to-[#111] rounded-xl shadow-lg overflow-hidden">
        <h2 className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-purple-300 font-semibold px-4 py-2 text-sm border-b border-purple-700/40">
          Output Preview
        </h2>
        {previewSrc ? (
          <iframe
            ref={iframeRef}
            src={previewSrc}
            className="w-full min-h-[60vh] md:min-h-[75vh] lg:min-h-[80vh] bg-white"
            style={{ border: "none" }}
          ></iframe>
        ) : (
          <div className="w-full min-h-[60vh] md:min-h-[75vh] lg:min-h-[80vh] flex items-center justify-center text-purple-300 bg-[#111]/50 border-t border-purple-700/30 italic">
            {validationErrors.some(e => e.severity === "error") 
              ? "❌ Perbaiki error terlebih dahulu" 
              : "⏳ Klik \"Run & Validate\" untuk melihat preview"}
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-[#1e1e1e] border border-purple-500/40 rounded-2xl shadow-2xl w-80 p-5 text-center">
            <h3 className="text-purple-300 font-semibold mb-3">{popupTitle}</h3>
            <input
              id="popup-input"
              autoFocus
              value={popupValue}
              onChange={(e) => setPopupValue(e.target.value)}
              placeholder="Nama file atau folder..."
              className="w-full bg-[#2a2a2a] text-white border border-purple-600/30 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition"
              >
                Batal
              </button>
              <button
                onClick={() => popupAction && popupAction()}
                className="px-3 py-1 bg-purple-700 text-white rounded-md hover:bg-purple-600 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}