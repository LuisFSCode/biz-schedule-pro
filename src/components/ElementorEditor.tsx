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
    if (!editorRef.current || grapesRef.current) return;

    // Initialize GrapesJS
    const editor = grapesjs.init({
      container: editorRef.current,
      height: '600px',
      width: '100%',
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
      storageManager: false, // Disable storage for now
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
        ],
      },
      panels: {
        defaults: [
          {
            id: 'layers',
            el: '.panel__right',
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: false,
              cl: true,
              cr: false,
              bc: false,
            },
          },
          {
            id: 'panel-switcher',
            el: '.panel__switcher',
            buttons: [
              {
                id: 'show-layers',
                active: true,
                label: 'Camadas',
                command: 'show-layers',
                togglable: false,
              },
              {
                id: 'show-style',
                active: true,
                label: 'Estilos',
                command: 'show-styles',
                togglable: false,
              },
            ],
          }
        ]
      },
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [
          {
            id: 'section',
            label: '<div><i class="fa fa-square-o"></i><br/>Seção</div>',
            category: 'Layout',
            content: '<section class="py-8 px-4 min-h-[200px] border-2 border-dashed border-gray-300"><div class="container mx-auto"><h2 class="text-2xl font-bold">Nova Seção</h2><p>Adicione seu conteúdo aqui...</p></div></section>',
            attributes: { class: 'fa fa-square-o' }
          },
          {
            id: 'text',
            label: '<div><i class="fa fa-text-width"></i><br/>Texto</div>',
            category: 'Básico',
            content: '<div class="text-component p-2">Clique para editar este texto</div>',
          },
          {
            id: 'image',
            label: '<div><i class="fa fa-image"></i><br/>Imagem</div>',
            category: 'Mídia',
            content: '<img src="https://via.placeholder.com/300x200?text=Sua+Imagem" alt="Imagem" class="max-w-full h-auto rounded">',
          },
          {
            id: 'button',
            label: '<div><i class="fa fa-hand-pointer-o"></i><br/>Botão</div>',
            category: 'Básico',
            content: '<a href="#" class="inline-block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Clique Aqui</a>',
          },
          {
            id: 'container',
            label: '<div><i class="fa fa-square"></i><br/>Container</div>',
            category: 'Layout',
            content: {
              type: 'container',
              droppable: true,
              style: {
                'min-height': '100px',
                'padding': '20px',
                'border': '2px dashed #ccc',
                'background-color': '#f9f9f9'
              },
              content: 'Arraste elementos aqui'
            }
          },
          {
            id: 'columns',
            label: '<div><i class="fa fa-columns"></i><br/>Colunas</div>',
            category: 'Layout',
            content: '<div class="flex flex-wrap gap-4"><div class="flex-1 min-w-[200px] p-4 border border-gray-200 rounded">Coluna 1</div><div class="flex-1 min-w-[200px] p-4 border border-gray-200 rounded">Coluna 2</div></div>',
          }
        ]
      },
      layerManager: {
        appendTo: '.layers-container'
      },
      traitManager: {
        appendTo: '.traits-container',
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [
          {
            name: 'Geral',
            open: false,
            buildProps: ['display', 'position', 'top', 'right', 'left', 'bottom'],
          },
          {
            name: 'Dimensões',
            open: true,
            buildProps: ['width', 'height', 'max-width', 'min-width', 'max-height', 'min-height', 'margin', 'padding'],
          },
          {
            name: 'Tipografia',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-shadow'],
          },
          {
            name: 'Decorações',
            open: false,
            buildProps: ['background-color', 'border-radius', 'border', 'box-shadow', 'background'],
          },
          {
            name: 'Extra',
            open: false,
            buildProps: ['transition', 'perspective', 'transform'],
          }
        ]
      },
    });

    // Customize some commands
    editor.Commands.add('show-layers', {
      getRowEl(editor: any) { return editor.getContainer().closest('.editor-row'); },
      getLayersEl(row: any) { return row.querySelector('.layers-container') },

      run(editor: any, sender: any) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
      },
      stop(editor: any, sender: any) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
      },
    });

    editor.Commands.add('show-styles', {
      getRowEl(editor: any) { return editor.getContainer().closest('.editor-row'); },
      getStyleEl(row: any) { return row.querySelector('.styles-container'); },

      run(editor: any, sender: any) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
      },
      stop(editor: any, sender: any) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });

    // Set initial content
    if (initialContent) {
      editor.setComponents(initialContent);
    } else {
      editor.setComponents(`
        <section id="customSection" class="py-16 px-4">
          <div class="container mx-auto text-center">
            <h2 class="text-3xl font-bold mb-8">Sua Seção Personalizada</h2>
            <p class="text-lg max-w-2xl mx-auto mb-8">
              Use os blocos na lateral esquerda para construir sua seção. Arraste e solte elementos aqui.
            </p>
            <div class="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
              <p class="text-gray-500">Zona de construção - Arraste elementos aqui</p>
            </div>
          </div>
        </section>
      `);
    }

    // Listen for changes
    editor.on('component:update component:add component:remove', () => {
      const html = editor.getHtml();
      const css = editor.getCss();
      const fullContent = css ? `<style>${css}</style>\n${html}` : html;
      onChange(fullContent);
    });

    grapesRef.current = editor;

    return () => {
      if (grapesRef.current) {
        grapesRef.current.destroy();
        grapesRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (grapesRef.current && initialContent) {
      grapesRef.current.setComponents(initialContent);
    }
  }, [initialContent]);

  return (
    <div className="grapesjs-editor-wrapper">
      {/* Load GrapesJS CSS */}
      <link rel="stylesheet" href="https://unpkg.com/grapesjs@0.21.7/dist/css/grapes.min.css" />
      
      <div className="editor-row flex h-[600px] border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Left Panel - Blocks */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200 font-semibold text-sm bg-gray-50">
            Elementos
          </div>
          <div className="blocks-container flex-1 overflow-auto p-2"></div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          <div ref={editorRef} className="flex-1"></div>
        </div>

        {/* Right Panel */}
        <div className="panel__right w-64 bg-white border-l border-gray-200 flex flex-col">
          <div className="panel__switcher flex border-b border-gray-200">
            {/* Panel buttons will be rendered here by GrapesJS */}
          </div>
          
          {/* Layers */}
          <div className="layers-container flex-1 overflow-auto">
            <div className="p-3 border-b border-gray-200 font-semibold text-sm bg-gray-50">
              Camadas
            </div>
          </div>
          
          {/* Styles */}
          <div className="styles-container flex-1 overflow-auto" style={{display: 'none'}}>
            <div className="p-3 border-b border-gray-200 font-semibold text-sm bg-gray-50">
              Estilos
            </div>
          </div>
          
          {/* Traits */}
          <div className="traits-container border-t border-gray-200">
            <div className="p-3 border-b border-gray-200 font-semibold text-sm bg-gray-50">
              Propriedades
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};