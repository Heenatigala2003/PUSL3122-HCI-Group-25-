dimport React, { useState, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Group, Circle, Line } from 'react-konva';

export interface Furniture {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  name: string;
  price: number;
  material?: string;
}

interface Canvas2DProps {
  roomWidth: number;
  roomHeight: number;
  furniture: Furniture[];
  setFurniture: React.Dispatch<React.SetStateAction<Furniture[]>>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  snapEnabled: boolean;
  roomColor?: string;
}

const GRID_SIZE = 25; // pixels (0.5m at 50px/m)

const snap = (val: number, enabled: boolean) =>
  enabled ? Math.round(val / GRID_SIZE) * GRID_SIZE : val;

const Canvas2D = ({
  roomWidth, roomHeight, furniture, setFurniture,
  selectedId, onSelect, snapEnabled, roomColor = '#f1f5f9'
}: Canvas2DProps) => {
  const pixelsPerMeter = 50;
  const canvasWidth = roomWidth * pixelsPerMeter;
  const canvasHeight = roomHeight * pixelsPerMeter;

  // Handle drag of a furniture item
  const handleDragEnd = useCallback((id: string, e: any) => {
    const { x, y } = e.target.attrs;
    setFurniture(prev => prev.map(item =>
      item.id === id
        ? { ...item, x: snap(x, snapEnabled), y: snap(y, snapEnabled) }
        : item
    ));
  }, [setFurniture, snapEnabled]);

  // Resize via corner drag
  const handleResizeDrag = useCallback((id: string, corner: string, e: any) => {
    const { x, y } = e.target.attrs;
    setFurniture(prev => prev.map(item => {
      if (item.id !== id) return item;
      let newW = item.width;
      let newH = item.height;
      let newX = item.x;
      let newY = item.y;

      const MIN = 20;
      if (corner === 'br') {
        newW = Math.max(MIN, snap(x - item.x, snapEnabled));
        newH = Math.max(MIN, snap(y - item.y, snapEnabled));
      } else if (corner === 'bl') {
        const dx = x - item.x;
        newW = Math.max(MIN, snap(item.width - dx, snapEnabled));
        newX = item.x + (item.width - newW);
        newH = Math.max(MIN, snap(y - item.y, snapEnabled));
      } else if (corner === 'tr') {
        const dy = y - item.y;
        newW = Math.max(MIN, snap(x - item.x, snapEnabled));
        newH = Math.max(MIN, snap(item.height - dy, snapEnabled));
        newY = item.y + (item.height - newH);
      } else if (corner === 'tl') {
        const dx = x - item.x;
        const dy = y - item.y;
        newW = Math.max(MIN, snap(item.width - dx, snapEnabled));
        newH = Math.max(MIN, snap(item.height - dy, snapEnabled));
        newX = item.x + (item.width - newW);
        newY = item.y + (item.height - newH);
      }
      return { ...item, x: newX, y: newY, width: newW, height: newH };
    }));
  }, [setFurniture, snapEnabled]);

  // Build grid lines
  const gridLines = [];
  if (snapEnabled) {
    for (let x = 0; x <= canvasWidth; x += GRID_SIZE) {
      gridLines.push(<Line key={`v-${x}`} points={[x, 0, x, canvasHeight]} stroke="#334155" strokeWidth={0.8}  opacity={0.35} />);
    }
    for (let y = 0; y <= canvasHeight; y += GRID_SIZE) {
      gridLines.push(<Line key={`h-${y}`} points={[0, y, canvasWidth, y]} stroke="#334155" strokeWidth={0.8} opacity={0.35} />);
    }
  }

  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onClick={(e) => { if (e.target === e.target.getStage()) onSelect(null); }}
        className="cursor-crosshair"
      >
        {/* Grid + Floor layer */}
        <Layer>
          <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill={roomColor} />
          {gridLines}
          {/* Room border */}
          <Rect x={0} y={0} width={canvasWidth} height={canvasHeight}
            fill="transparent" stroke="#64748b" strokeWidth={2} />
        </Layer>

        {/* Furniture layer */}
        <Layer>
          {furniture.map((item) => {
            const isSelected = item.id === selectedId;

            // Corner handle positions (relative to item)
            const corners = [
              { key: 'tl', cx: 0, cy: 0 },
              { key: 'tr', cx: item.width, cy: 0 },
              { key: 'bl', cx: 0, cy: item.height },
              { key: 'br', cx: item.width, cy: item.height },
            ];

            return (
              <Group
                key={item.id}
                x={item.x}
                y={item.y}
                draggable
                onClick={() => onSelect(item.id)}
                onTap={() => onSelect(item.id)}
                onDragEnd={(e) => handleDragEnd(item.id, e)}
              >
                {/* Body */}
                <Rect
                  width={item.width}
                  height={item.height}
                  fill={item.color}
                  cornerRadius={5}
                  shadowBlur={isSelected ? 12 : 4}
                  shadowColor={isSelected ? '#0ea5e9' : '#000'}
                  shadowOpacity={isSelected ? 0.6 : 0.2}
                />

                {/* Selection border */}
                {isSelected && (
                  <Rect
                    x={-2} y={-2}
                    width={item.width + 4}
                    height={item.height + 4}
                    fill="transparent"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dash={[6, 3]}
                    cornerRadius={7}
                  />
                )}

                {/* Label */}
                <Text
                  text={item.name}
                  fontSize={11}
                  fontStyle="bold"
                  fill="rgba(255,255,255,0.9)"
                  align="center"
                  verticalAlign="middle"
                  width={item.width}
                  height={item.height}
                />

                {/* Corner resize handles (only when selected) */}
                {isSelected && corners.map(({ key, cx, cy }) => (
                  <Circle
                    key={key}
                    x={cx}
                    y={cy}
                    radius={7}
                    fill="#0ea5e9"
                    stroke="#fff"
                    strokeWidth={1.5}
                    draggable
                    onDragEnd={(e) => handleResizeDrag(item.id, key, e)}
                    onMouseEnter={(e: any) => { e.target.getStage().container().style.cursor = 'nwse-resize'; }}
                    onMouseLeave={(e: any) => { e.target.getStage().container().style.cursor = 'crosshair'; }}
                  />
                ))}
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas2D;
