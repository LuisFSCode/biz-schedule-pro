import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import gjsPresetWebpage from "grapesjs-preset-webpage";

interface ElementorEditorProps {
  initialContent?: string;
  onChange: (htmlContent: string) => void;
}

export const ElementorEditor = ({ initialContent, onChange }: ElementorEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const grapesRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Initialize GrapesJS
    const editor = grapesjs.init({
      container: editorRef.current,
      height: '500px',
      width: 'auto',
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        'gjs-preset-webpage': {
          modalImportTitle: 'Importar Código',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Cole aqui seu código HTML/CSS</div>',
          modalImportContent: function(editor: any) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          },
          filestackOpts: null,
          aviaryOpts: false,
          countlyOpts: false,
        }
      },
      storageManager: {
        id: 'gjs-',
        type: 'local',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
      },
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
        ],
      },
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [
          {
            id: 'section',
            label: '<i class="fa fa-square-o"></i><div>Seção</div>',
            category: 'Layout',
            content: '<section class="py-8 px-4"><div class="container mx-auto"><h2>Nova Seção</h2></div></section>',
            attributes: { class: 'fa fa-square-o' }
          },
          {
            id: 'text',
            label: '<i class="fa fa-text-width"></i><div>Texto</div>',
            category: 'Básico',
            content: '<div class="text-component">Insira seu texto aqui</div>',
          },
          {
            id: 'image',
            label: '<i class="fa fa-image"></i><div>Imagem</div>',
            category: 'Mídia',
            content: '<img src="https://via.placeholder.com/300x200" alt="Imagem" class="max-w-full h-auto">',
          },
          {
            id: 'button',
            label: '<i class="fa fa-hand-pointer-o"></i><div>Botão</div>',
            category: 'Básico',
            content: '<button class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Clique aqui</button>',
          },
          {
            id: 'container',
            label: '<i class="fa fa-square"></i><div>Container</div>',
            category: 'Layout',
            content: '<div class="container-component p-4 border-2 border-dashed border-gray-300 min-h-[100px]">Arraste elementos aqui</div>',
            attributes: { 'data-droppable': true }
          },
          {
            id: 'row',
            label: '<i class="fa fa-columns"></i><div>Linha</div>',
            category: 'Layout',
            content: '<div class="flex flex-wrap gap-4"><div class="flex-1 p-4 border border-gray-200">Coluna 1</div><div class="flex-1 p-4 border border-gray-200">Coluna 2</div></div>',
          }
        ]
      },
      layerManager: {
        appendTo: '.layers-container'
      },
      traitManager: {
        appendTo: '.traits-container',
      },
      selectorManager: {
        appendTo: '.styles-container'
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [{
          name: 'Dimensões',
          open: false,
          buildProps: ['width', 'min-height', 'padding'],
          properties: [{
            type: 'integer',
            name: 'Largura',
            property: 'width',
            units: ['px', '%'],
            defaults: 'auto',
            min: 0,
          }]
        }, {
          name: 'Decoração',
          open: false,
          buildProps: ['color', 'background-color', 'border-radius', 'border'],
          properties: [{
            name: 'Cor do Texto',
            property: 'color',
            type: 'color',
          }, {
            name: 'Cor do Fundo',
            property: 'background-color',
            type: 'color',
          }]
        }]
      },
    });

    // Set initial content if provided
    if (initialContent) {
      editor.setComponents(initialContent);
    } else {
      editor.setComponents(`
        <section id="customSection" class="py-16 px-4">
          <div class="container mx-auto">
            <h2 class="text-3xl font-bold text-center mb-8">Sua Seção Personalizada</h2>
            <p class="text-center max-w-2xl mx-auto">
              Arraste elementos do painel lateral para começar a construir sua seção.
            </p>
          </div>
        </section>
      `);
    }

    // Listen for changes and notify parent
    editor.on('component:update storage:end', () => {
      const html = editor.getHtml();
      const css = editor.getCss();
      const fullContent = css ? `<style>${css}</style>${html}` : html;
      onChange(fullContent);
    });

    grapesRef.current = editor;

    return () => {
      if (grapesRef.current) {
        grapesRef.current.destroy();
      }
    };
  }, [initialContent, onChange]);

  return (
    <div className="grapesjs-editor-wrapper border rounded-lg overflow-hidden bg-white">
      <div ref={editorRef} className="grapesjs-editor" />
    </div>
  );
};