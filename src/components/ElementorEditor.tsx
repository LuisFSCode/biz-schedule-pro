import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Move, Type, Image, Layout, Trash2 } from "lucide-react";

interface ElementData {
  id: string;
  type: 'text' | 'image' | 'button' | 'container';
  content: string;
  styles: {
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
  };
}

interface ElementorEditorProps {
  initialContent?: string;
  onChange: (htmlContent: string) => void;
}

const ELEMENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  CONTAINER: 'container'
};

const DraggableElement = ({ element, index, moveElement, updateElement, deleteElement }: {
  element: ElementData;
  index: number;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
  updateElement: (index: number, updates: Partial<ElementData>) => void;
  deleteElement: (index: number) => void;
}) => {
  const [, ref] = useDrag({
    type: 'element',
    item: { index }
  });

  const [, drop] = useDrop({
    accept: 'element',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveElement(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (newContent: string) => {
    updateElement(index, { content: newContent });
  };

  const handleStyleChange = (styleKey: string, value: string) => {
    updateElement(index, {
      styles: { ...element.styles, [styleKey]: value }
    });
  };

  const renderElement = () => {
    const style = {
      textAlign: element.styles.textAlign,
      fontSize: element.styles.fontSize,
      color: element.styles.color,
      backgroundColor: element.styles.backgroundColor,
      padding: element.styles.padding || '12px',
      margin: element.styles.margin || '4px'
    };

    switch (element.type) {
      case 'text':
        return (
          <div style={style} className="min-h-[40px] border border-dashed border-gray-300 rounded">
            {isEditing ? (
              <Textarea
                value={element.content}
                onChange={(e) => handleContentChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="border-none resize-none"
              />
            ) : (
              <div onClick={() => setIsEditing(true)} className="cursor-text">
                {element.content || 'Clique para editar texto'}
              </div>
            )}
          </div>
        );
      case 'image':
        return (
          <div style={style} className="min-h-[100px] border border-dashed border-gray-300 rounded flex items-center justify-center">
            {element.content ? (
              <img src={element.content} alt="Elemento" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-gray-500 text-center">
                <Image className="mx-auto mb-2" size={24} />
                <Input
                  placeholder="URL da imagem"
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        );
      case 'button':
        return (
          <div style={style} className="min-h-[40px] border border-dashed border-gray-300 rounded">
            {isEditing ? (
              <Input
                value={element.content}
                onChange={(e) => handleContentChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="border-none"
              />
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="w-full"
              >
                {element.content || 'Texto do Botão'}
              </Button>
            )}
          </div>
        );
      case 'container':
        return (
          <div style={style} className="min-h-[80px] border border-dashed border-gray-300 rounded">
            <div className="text-gray-500 text-center p-4">
              Container - Adicione elementos aqui
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={(node) => ref(drop(node))} className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
          <Move size={12} />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 w-6 p-0"
          onClick={() => deleteElement(index)}
        >
          <Trash2 size={12} />
        </Button>
      </div>
      
      {renderElement()}
      
      {/* Style Controls */}
      <div className="mt-2 p-2 bg-gray-50 rounded text-xs space-y-1">
        <div className="flex gap-2">
          <select 
            value={element.styles.textAlign || 'left'} 
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            className="text-xs border rounded px-1"
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
          <Input
            placeholder="Cor"
            type="color"
            value={element.styles.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="w-12 h-6 p-0 border rounded"
          />
          <Input
            placeholder="Fundo"
            type="color"
            value={element.styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-12 h-6 p-0 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export const ElementorEditor = ({ initialContent, onChange }: ElementorEditorProps) => {
  const [elements, setElements] = useState<ElementData[]>([]);

  const addElement = (type: string) => {
    const newElement: ElementData = {
      id: `element-${Date.now()}`,
      type: type as ElementData['type'],
      content: '',
      styles: {
        textAlign: 'left',
        fontSize: '16px',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: '12px',
        margin: '4px'
      }
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    generateHTML(newElements);
  };

  const moveElement = (dragIndex: number, hoverIndex: number) => {
    const draggedElement = elements[dragIndex];
    const newElements = [...elements];
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, draggedElement);
    setElements(newElements);
    generateHTML(newElements);
  };

  const updateElement = (index: number, updates: Partial<ElementData>) => {
    const newElements = [...elements];
    newElements[index] = { ...newElements[index], ...updates };
    setElements(newElements);
    generateHTML(newElements);
  };

  const deleteElement = (index: number) => {
    const newElements = elements.filter((_, i) => i !== index);
    setElements(newElements);
    generateHTML(newElements);
  };

  const generateHTML = (elementsList: ElementData[]) => {
    const html = `
<section id="customSection" class="py-16 px-4">
  <div class="container mx-auto">
    ${elementsList.map(element => {
      const styles = `
        text-align: ${element.styles.textAlign || 'left'};
        font-size: ${element.styles.fontSize || '16px'};
        color: ${element.styles.color || '#000000'};
        background-color: ${element.styles.backgroundColor || 'transparent'};
        padding: ${element.styles.padding || '12px'};
        margin: ${element.styles.margin || '4px'};
      `.trim();

      switch (element.type) {
        case 'text':
          return `<div style="${styles}">${element.content || 'Texto'}</div>`;
        case 'image':
          return element.content ? `<img src="${element.content}" style="${styles}" alt="Imagem" />` : '';
        case 'button':
          return `<button style="${styles}" class="px-6 py-2 rounded">${element.content || 'Botão'}</button>`;
        case 'container':
          return `<div style="${styles}" class="border-2 border-dashed border-gray-300 min-h-[100px]">Container</div>`;
        default:
          return '';
      }
    }).join('\n    ')}
  </div>
</section>`.trim();
    
    onChange(html);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="border rounded-lg p-4 bg-white min-h-[400px]">
        {/* Toolbar */}
        <div className="flex gap-2 mb-4 p-2 bg-gray-100 rounded">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => addElement('text')}
            className="flex items-center gap-1"
          >
            <Type size={16} />
            Texto
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => addElement('image')}
            className="flex items-center gap-1"
          >
            <Image size={16} />
            Imagem
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => addElement('button')}
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            Botão
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => addElement('container')}
            className="flex items-center gap-1"
          >
            <Layout size={16} />
            Container
          </Button>
        </div>

        {/* Canvas */}
        <div className="min-h-[300px] border-2 border-dashed border-gray-200 rounded p-4 space-y-4">
          {elements.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Layout className="mx-auto mb-4" size={48} />
              <p>Arraste elementos aqui para começar a construir sua seção</p>
            </div>
          ) : (
            elements.map((element, index) => (
              <DraggableElement
                key={element.id}
                element={element}
                index={index}
                moveElement={moveElement}
                updateElement={updateElement}
                deleteElement={deleteElement}
              />
            ))
          )}
        </div>
      </div>
    </DndProvider>
  );
};