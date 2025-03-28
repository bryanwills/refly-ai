import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useCanvasContext } from '../../context/canvas';
import { useCanvasStore, useCanvasStoreShallow } from '../../stores/canvas';
import { CanvasNodeData } from '../../components/canvas/nodes';

export const usePatchNodeData = (selectedCanvasId?: string) => {
  const { canvasId: contextCanvasId, provider } = useCanvasContext();
  const { canvasId: routeCanvasId } = useParams();
  const ydoc = provider?.document;

  const { setNodes } = useCanvasStoreShallow((state) => ({
    setNodes: state.setNodes,
  }));

  const syncNodesToYDoc = useCallback(
    (nodes: any[]) => {
      if (!nodes?.length || !ydoc || provider?.status !== 'connected') return;

      try {
        ydoc.transact(() => {
          const yNodes = ydoc.getArray('nodes');
          if (!yNodes) return;

          yNodes.delete(0, yNodes.length ?? 0);
          yNodes.push(nodes);
        });
      } catch (error) {
        console.error('Transaction error when syncing nodes:', error);

        // Special handling for database connection closing
        if (error instanceof DOMException && error.name === 'InvalidStateError') {
          console.warn('Database connection is closing. Transaction aborted.');
        }
      }
    },
    [ydoc, provider],
  );

  return useCallback(
    <T = any>(nodeId: string, nodeData: Partial<CanvasNodeData<T>>) => {
      const canvasId = selectedCanvasId ?? contextCanvasId ?? routeCanvasId;
      const currentNodes = useCanvasStore.getState().data[canvasId]?.nodes ?? [];
      const updatedNodes = currentNodes.map((n) => ({
        ...n,
        data:
          n.id === nodeId
            ? { ...n.data, ...nodeData, metadata: { ...n.data?.metadata, ...nodeData.metadata } }
            : n.data,
      }));
      setNodes(canvasId, updatedNodes);
      syncNodesToYDoc(updatedNodes);
    },
    [contextCanvasId, routeCanvasId, selectedCanvasId, setNodes, syncNodesToYDoc],
  );
};
