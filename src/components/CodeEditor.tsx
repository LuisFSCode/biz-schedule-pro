import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Copy, Download, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export const CodeEditor = ({ value, onChange, language = "html" }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  const defaultCode = `<section id="aboutEmpresa" class="py-16 px-4">
  <div class="container mx-auto">
    <!-- Empresário, insira seu conteúdo aqui. Se tiver dúvidas, veja o tutorial: link.editarsection.com -->
    <h2 class="text-3xl font-bold text-center mb-8">Sobre Nós</h2>
    <p class="text-center max-w-2xl mx-auto">
      Adicione aqui o conteúdo personalizado do seu estabelecimento.
    </p>
  </div>
</section>`;

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copiado!",
        description: "Código copiado para a área de transferência.",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código.",
        variant: "destructive"
      });
    }
  };

  const downloadCode = () => {
    const blob = new Blob([value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'secao-personalizada.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado",
      description: "Arquivo HTML baixado com sucesso.",
    });
  };

  const resetToDefault = () => {
    onChange(defaultCode);
    toast({
      title: "Código restaurado",
      description: "Código voltou ao padrão inicial.",
    });
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-[#2d2d30] p-2 border-b border-gray-600">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-300 text-sm ml-2">editor-visual.html</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="text-gray-300 hover:text-white hover:bg-gray-600 h-7 px-2"
          >
            <Copy size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={downloadCode}
            className="text-gray-300 hover:text-white hover:bg-gray-600 h-7 px-2"
          >
            <Download size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={formatCode}
            className="text-gray-300 hover:text-white hover:bg-gray-600 h-7 px-2 text-xs"
          >
            Format
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetToDefault}
            className="text-gray-300 hover:text-white hover:bg-gray-600 h-7 px-2"
          >
            <RotateCcw size={14} />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <Editor
          height="400px"
          language={language}
          value={value || defaultCode}
          onChange={(newValue) => onChange(newValue || "")}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: false,
            contextmenu: true,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showClasses: true,
              showFunctions: true,
              showVariables: true,
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true
            },
            parameterHints: {
              enabled: true
            },
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: "on",
            accessibilitySupport: "auto"
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-[#007acc] text-white text-xs px-3 py-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>HTML</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Tailwind CSS disponível</span>
          <span>Ctrl+S para formatar</span>
        </div>
      </div>
    </div>
  );
};