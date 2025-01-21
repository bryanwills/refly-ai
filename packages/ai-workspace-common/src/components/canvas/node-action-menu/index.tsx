import { Button, Divider, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { FC, useCallback, useMemo, useEffect, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  IconRerun,
  IconDelete,
  IconAskAI,
  IconRun,
  IconPreview,
  IconExpand,
  IconShrink,
  IconCopy,
  IconMemo,
  IconDeleteFile,
} from '@refly-packages/ai-workspace-common/components/common/icon';
import { useCanvasStoreShallow } from '@refly-packages/ai-workspace-common/stores/canvas';
import { CanvasNode } from '@refly-packages/ai-workspace-common/components/canvas/nodes';
import {
  FileInput,
  MessageSquareDiff,
  FilePlus,
  Ungroup,
  Group,
  MoveVertical,
  Target,
  Layout,
  Edit,
} from 'lucide-react';
import { GrClone } from 'react-icons/gr';
import { locateToNodePreviewEmitter } from '@refly-packages/ai-workspace-common/events/locateToNodePreview';
import { nodeActionEmitter, createNodeEventName } from '@refly-packages/ai-workspace-common/events/nodeActions';
import { useDocumentStoreShallow } from '@refly-packages/ai-workspace-common/stores/document';
import { CanvasNodeType } from '@refly/openapi-schema';
import { useCanvasContext } from '@refly-packages/ai-workspace-common/context/canvas';
import { useUngroupNodes } from '@refly-packages/ai-workspace-common/hooks/canvas/use-batch-nodes-selection/use-ungroup-nodes';
import { useNodeOperations } from '@refly-packages/ai-workspace-common/hooks/canvas/use-node-operations';
import { useNodeCluster } from '@refly-packages/ai-workspace-common/hooks/canvas/use-node-cluster';
import { copyToClipboard } from '@refly-packages/ai-workspace-common/utils';
import { useCreateMemo } from '@refly-packages/ai-workspace-common/hooks/canvas/use-create-memo';
import { HoverCard, HoverContent } from '@refly-packages/ai-workspace-common/components/hover-card';

interface MenuItem {
  key: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  loading?: boolean;
  danger?: boolean;
  primary?: boolean;
  type: 'button' | 'divider';
  disabled?: boolean;
  hoverContent?: HoverContent;
}

interface NodeActionMenuProps {
  nodeId: string;
  nodeType: CanvasNodeType;
  onClose?: () => void;
  isProcessing?: boolean;
  isCompleted?: boolean;
  isCreatingDocument?: boolean;
  isMultiSelection?: boolean;
  onHoverCardStateChange?: (isHovered: boolean) => void;
}

export const NodeActionMenu: FC<NodeActionMenuProps> = ({
  nodeId,
  nodeType,
  onClose,
  isMultiSelection,
  onHoverCardStateChange,
}) => {
  const { t } = useTranslation();
  const { getNode } = useReactFlow();
  const { canvasId } = useCanvasContext();
  const { setNodeSizeMode } = useNodeOperations();

  const { activeDocumentId } = useDocumentStoreShallow((state) => ({
    activeDocumentId: state.activeDocumentId,
  }));

  const node = useMemo(() => getNode(nodeId) as CanvasNode, [nodeId, getNode]);
  const nodeData = useMemo(() => node?.data, [node]);
  const [localSizeMode, setLocalSizeMode] = useState(() => nodeData?.metadata?.sizeMode || 'adaptive');

  const [cloneAskAIRunning, setCloneAskAIRunning] = useState(false);

  useEffect(() => {
    setLocalSizeMode(nodeData?.metadata?.sizeMode || 'adaptive');
  }, [nodeData?.metadata?.sizeMode]);

  const addNodePreview = useCanvasStoreShallow((state) => state.addNodePreview);
  const { ungroupNodes } = useUngroupNodes();

  const handleAskAI = useCallback(() => {
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'askAI'));
    onClose?.();
  }, [nodeId, onClose]);

  const handleRun = useCallback(() => {
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'run'));
    onClose?.();
  }, [nodeId]);

  const handleCloneAskAI = useCallback(() => {
    setCloneAskAIRunning(true);
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'cloneAskAI'));
    nodeActionEmitter.on(createNodeEventName(nodeId, 'cloneAskAI.completed'), () => {
      setCloneAskAIRunning(false);
    });
    onClose?.();
  }, [nodeId, onClose]);

  const handleRerun = useCallback(() => {
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'rerun'));
    onClose?.();
  }, [nodeId]);

  const handleDelete = useCallback(() => {
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'delete'));
    onClose?.();
  }, [nodeId]);

  const handleDeleteFile = useCallback(() => {
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'deleteFile'));
    onClose?.();
  }, [nodeId, onClose]);

  const handleAddToContext = useCallback(() => {
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'addToContext'));
    onClose?.();
  }, [nodeId]);

  const handleCreateDocument = useCallback(() => {
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'createDocument'));
    onClose?.();
  }, [nodeId]);

  const handleInsertToDoc = useCallback(() => {
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'insertToDoc'), {
      content: nodeData?.contentPreview,
    });
    onClose?.();
  }, [nodeId, nodeData?.contentPreview]);

  const handlePreview = useCallback(() => {
    addNodePreview(canvasId, node);
    locateToNodePreviewEmitter.emit('locateToNodePreview', { id: nodeId, canvasId });
    onClose?.();
  }, [node, nodeId, canvasId]);

  const handleUngroup = useCallback(() => {
    ungroupNodes(nodeId);
    onClose?.();
  }, [ungroupNodes, nodeId, onClose]);

  const handleToggleSizeMode = useCallback(() => {
    const newMode = localSizeMode === 'compact' ? 'adaptive' : 'compact';
    setLocalSizeMode(newMode);
    setNodeSizeMode(nodeId, newMode);
    onClose?.();
  }, [nodeId, localSizeMode, setNodeSizeMode, onClose]);

  const { selectNodeCluster, groupNodeCluster, layoutNodeCluster } = useNodeCluster();

  const handleSelectCluster = useCallback(() => {
    if (nodeType === 'group') {
      nodeActionEmitter.emit(createNodeEventName(nodeId, 'selectCluster'));
    } else {
      selectNodeCluster(nodeId);
    }
    onClose?.();
  }, [nodeId, nodeType, selectNodeCluster, onClose]);

  const handleGroupCluster = useCallback(() => {
    if (nodeType === 'group') {
      nodeActionEmitter.emit(createNodeEventName(nodeId, 'groupCluster'));
    } else {
      groupNodeCluster(nodeId);
    }
    onClose?.();
  }, [nodeId, nodeType, groupNodeCluster, onClose]);

  const handleLayoutCluster = useCallback(() => {
    if (nodeType === 'group') {
      nodeActionEmitter.emit(createNodeEventName(nodeId, 'layoutCluster'));
    } else {
      layoutNodeCluster(nodeId);
    }
    onClose?.();
  }, [nodeId, nodeType, layoutNodeCluster, onClose]);

  const handleCopy = useCallback(() => {
    const content = nodeData?.contentPreview;

    copyToClipboard(content || '');
    message.success(t('copilot.message.copySuccess'));
    onClose?.();
  }, [nodeData?.contentPreview, onClose]);

  const handleEditQuery = useCallback(() => {
    addNodePreview(canvasId, node);

    setTimeout(() => {
      locateToNodePreviewEmitter.emit('locateToNodePreview', {
        id: nodeId,
        canvasId,
        type: 'editResponse',
      });
    }, 100);

    onClose?.();
  }, [nodeId, canvasId, node, addNodePreview, onClose]);
  const { createMemo } = useCreateMemo();

  const handleCreateMemo = useCallback(() => {
    createMemo({
      content: '',
      position: undefined,
      sourceNode: {
        type: nodeType,
        entityId: nodeData?.entityId,
      },
    });
    onClose?.();
  }, [nodeData, node?.position, nodeType, createMemo, onClose]);

  const handleDuplicateDocument = useCallback(() => {
    nodeActionEmitter.emit(createNodeEventName(nodeId, 'duplicateDocument'));
    onClose?.();
  }, [nodeId, onClose]);

  const getMenuItems = (activeDocumentId: string): MenuItem[] => {
    if (isMultiSelection) {
      return [
        {
          key: 'askAI',
          icon: IconAskAI,
          label: t('canvas.nodeActions.askAI'),
          onClick: handleAskAI,
          type: 'button' as const,
          primary: true,
          hoverContent: {
            title: t('canvas.nodeActions.askAI'),
            description: t('canvas.nodeActions.askAIDescription'),
            videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
          },
        },
        { key: 'divider-1', type: 'divider' } as MenuItem,
        {
          key: 'addToContext',
          icon: MessageSquareDiff,
          label: t('canvas.nodeActions.addToContext'),
          onClick: handleAddToContext,
          type: 'button' as const,
          hoverContent: {
            title: t('canvas.nodeActions.addToContext'),
            description: t('canvas.nodeActions.addToContextDescription'),
            videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
          },
        },
        { key: 'divider-2', type: 'divider' } as MenuItem,
        {
          key: 'delete',
          icon: IconDelete,
          label: t('canvas.nodeActions.delete'),
          onClick: handleDelete,
          danger: true,
          type: 'button' as const,
          hoverContent: {
            title: t('canvas.nodeActions.delete'),
            description: t('canvas.nodeActions.deleteDescription'),
            videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
          },
        },
      ];
    }

    const commonItems: MenuItem[] = [
      {
        key: 'askAI',
        icon: IconAskAI,
        label: t('canvas.nodeActions.askAI'),
        onClick: handleAskAI,
        type: 'button' as const,
        primary: true,
        hoverContent: {
          title: t('canvas.nodeActions.askAI'),
          description: t('canvas.nodeActions.askAIDescription'),
          videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
        },
      },
      ...(nodeType === 'skillResponse'
        ? [
            {
              key: 'cloneAskAI',
              icon: GrClone,
              loading: cloneAskAIRunning,
              label: t('canvas.nodeActions.cloneAskAI'),
              onClick: handleCloneAskAI,
              type: 'button' as const,
              hoverContent: {
                title: t('canvas.nodeActions.cloneAskAI'),
                description: t('canvas.nodeActions.cloneAskAIDescription'),
                videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
              },
            },
            {
              key: 'editQuery',
              icon: Edit,
              label: t('canvas.nodeActions.editQuery'),
              onClick: handleEditQuery,
              type: 'button' as const,
              hoverContent: {
                title: t('canvas.nodeActions.editQuery'),
                description: t('canvas.nodeActions.editQueryDescription'),
                videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
              },
            },
            {
              key: 'rerun',
              icon: IconRerun,
              label: t('canvas.nodeActions.rerun'),
              onClick: handleRerun,
              type: 'button' as const,
              hoverContent: {
                title: t('canvas.nodeActions.rerun'),
                description: t('canvas.nodeActions.rerunDescription'),
                videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
              },
            },
          ]
        : []),
      {
        key: 'addToContext',
        icon: MessageSquareDiff,
        label: t('canvas.nodeActions.addToContext'),
        onClick: handleAddToContext,
        type: 'button' as const,
        hoverContent: {
          title: t('canvas.nodeActions.addToContext'),
          description: t('canvas.nodeActions.addToContextDescription'),
          videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
        },
      },
    ];

    const operationItems: MenuItem[] = [
      {
        key: 'preview',
        icon: IconPreview,
        label: t('canvas.nodeActions.preview'),
        onClick: handlePreview,
        type: 'button' as const,
        hoverContent: {
          title: t('canvas.nodeActions.preview'),
          description: t('canvas.nodeActions.previewDescription'),
          videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
        },
      },
      { key: 'divider-1', type: 'divider' } as MenuItem,
      {
        key: 'toggleSizeMode',
        icon: localSizeMode === 'compact' ? IconExpand : IconShrink,
        label: localSizeMode === 'compact' ? t('canvas.nodeActions.adaptiveMode') : t('canvas.nodeActions.compactMode'),
        onClick: handleToggleSizeMode,
        type: 'button' as const,
        hoverContent: {
          title:
            localSizeMode === 'compact' ? t('canvas.nodeActions.adaptiveMode') : t('canvas.nodeActions.compactMode'),
          description:
            localSizeMode === 'compact'
              ? t('canvas.nodeActions.adaptiveModeDescription')
              : t('canvas.nodeActions.compactModeDescription'),
          videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
        },
      },
    ].filter(Boolean);

    const nodeTypeItems: Record<string, MenuItem[]> = {
      document: [],
      resource: [],
      memo: [
        {
          key: 'insertToDoc',
          icon: FileInput,
          label: t('canvas.nodeActions.insertToDoc'),
          onClick: handleInsertToDoc,
          type: 'button' as const,
          disabled: !activeDocumentId,
          hoverContent: {
            title: t('canvas.nodeActions.insertToDoc'),
            description: t('canvas.nodeActions.insertToDocDescription'),
            videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
          },
        },
      ],
      group: [
        {
          key: 'ungroup',
          icon: Ungroup,
          label: t('canvas.nodeActions.ungroup'),
          onClick: handleUngroup,
          type: 'button' as const,
          hoverContent: {
            title: t('canvas.nodeActions.ungroup'),
            description: t('canvas.nodeActions.ungroupDescription'),
            videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
          },
        },
      ],
      skill: [
        {
          key: 'run',
          icon: IconRun,
          label: t('canvas.nodeActions.run'),
          onClick: handleRun,
          type: 'button' as const,
          hoverContent: {
            title: t('canvas.nodeActions.run'),
            description: t('canvas.nodeActions.runDescription'),
            videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
          },
        },
      ],
      skillResponse: [
        {
          key: 'insertToDoc',
          icon: FileInput,
          label: t('canvas.nodeActions.insertToDoc'),
          onClick: handleInsertToDoc,
          type: 'button' as const,
          disabled: !activeDocumentId,
          hoverContent: {
            title: t('canvas.nodeActions.insertToDoc'),
            description: t('canvas.nodeActions.insertToDocDescription'),
            videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
          },
        },
        nodeData?.contentPreview
          ? {
              key: 'createDocument',
              icon: FilePlus,
              label: t('canvas.nodeStatus.createDocument'),
              onClick: handleCreateDocument,
              type: 'button' as const,
              hoverContent: {
                title: t('canvas.nodeStatus.createDocument'),
                description: t('canvas.nodeActions.createDocumentDescription'),
                videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
              },
            }
          : null,
      ].filter(Boolean),
    };

    const footerItems: MenuItem[] = [
      ...(nodeType !== 'skill' && nodeType !== 'group'
        ? [
            ...(nodeType === 'document'
              ? [
                  {
                    key: 'duplicateDocument',
                    icon: GrClone,
                    label: t('canvas.nodeActions.duplicateDocument'),
                    onClick: handleDuplicateDocument,
                    type: 'button' as const,
                    hoverContent: {
                      title: t('canvas.nodeActions.duplicateDocument'),
                      description: t('canvas.nodeActions.duplicateDocumentDescription'),
                      videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
                    },
                  },
                ]
              : []),
            {
              key: 'createMemo',
              icon: IconMemo,
              label: t('canvas.nodeActions.createMemo'),
              onClick: handleCreateMemo,
              type: 'button' as const,
              hoverContent: {
                title: t('canvas.nodeActions.createMemo'),
                description: t('canvas.nodeActions.createMemoDescription'),
                videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
              },
            },
            {
              key: 'copy',
              icon: IconCopy,
              label: t('canvas.nodeActions.copy'),
              onClick: handleCopy,
              type: 'button' as const,
              hoverContent: {
                title: t('canvas.nodeActions.copy'),
                description: t('canvas.nodeActions.copyDescription'),
                videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
              },
            },
          ]
        : []),
      {
        key: 'delete',
        icon: IconDelete,
        label: t('canvas.nodeActions.delete'),
        onClick: handleDelete,
        danger: true,
        type: 'button' as const,
        hoverContent: {
          title: t('canvas.nodeActions.delete'),
          description: t('canvas.nodeActions.deleteDescription'),
          videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
        },
      },
      ...(['document', 'resource'].includes(nodeType)
        ? [
            {
              key: 'deleteFile',
              icon: IconDeleteFile,
              label: `${t('common.delete')}${nodeType === 'document' ? t('common.document') : t('common.resource')}`,
              onClick: handleDeleteFile,
              danger: true,
              type: 'button' as const,
              hoverContent: {
                title: `${t('common.delete')}${nodeType === 'document' ? t('common.document') : t('common.resource')}`,
                description: t('canvas.nodeActions.deleteFileDescription', {
                  type: t(`common.${nodeType}`),
                }),
                videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
              },
            },
          ]
        : []),
    ];

    const clusterItems: MenuItem[] = [
      { key: 'divider-cluster', type: 'divider' } as MenuItem,
      {
        key: 'selectCluster',
        icon: Target,
        label: t('canvas.nodeActions.selectCluster'),
        onClick: handleSelectCluster,
        type: 'button' as const,
        hoverContent: {
          title: t('canvas.nodeActions.selectCluster'),
          description: t('canvas.nodeActions.selectClusterDescription'),
          videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
        },
      },
      {
        key: 'groupCluster',
        icon: Group,
        label: t('canvas.nodeActions.groupCluster'),
        onClick: handleGroupCluster,
        type: 'button' as const,
        hoverContent: {
          title: t('canvas.nodeActions.groupCluster'),
          description: t('canvas.nodeActions.groupClusterDescription'),
          videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
        },
      },
      {
        key: 'layoutCluster',
        icon: Layout,
        label: t('canvas.nodeActions.layoutCluster'),
        onClick: handleLayoutCluster,
        type: 'button' as const,
        hoverContent: {
          title: t('canvas.nodeActions.layoutCluster'),
          description: t('canvas.nodeActions.layoutClusterDescription'),
          videoUrl: 'https://static.refly.ai/static/refly-docs.mp4',
        },
      },
    ];

    return [
      ...(nodeType !== 'skill' ? commonItems : []),
      ...(nodeType !== 'memo' && nodeType !== 'skill' && nodeType !== 'group' ? operationItems : []),
      ...(nodeTypeItems[nodeType] || []),
      ...(nodeType !== 'memo' && nodeType !== 'skill' ? clusterItems : []),
      { key: 'divider-2', type: 'divider' } as MenuItem,
      ...footerItems,
    ].filter(Boolean);
  };

  const menuItems = useMemo(
    () => getMenuItems(activeDocumentId),
    [
      activeDocumentId,
      cloneAskAIRunning,
      nodeType,
      nodeData?.contentPreview,
      handleRerun,
      handleDelete,
      handleAddToContext,
      handleCreateDocument,
      handleInsertToDoc,
      handlePreview,
      t,
      localSizeMode,
      handleToggleSizeMode,
    ],
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 w-[200px] border border-[rgba(0,0,0,0.06)]">
      {menuItems.map((item, index) => {
        if (item?.type === 'divider') {
          return <Divider key={index} className="my-1 h-[1px] bg-gray-100" />;
        }

        const button = (
          <Button
            key={index}
            className={`
              w-full
              h-8
              flex
              items-center
              gap-2
              px-2
              rounded
              text-sm
              transition-colors
              text-gray-700 hover:bg-gray-50 hover:text-gray-700
              ${item.danger ? '!text-red-600 hover:bg-red-50' : ''}
              ${item.primary ? '!text-primary-600 hover:bg-primary-50' : ''}
              ${item.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            type="text"
            icon={<item.icon className="w-4 h-4" />}
            loading={item.loading}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            <span className="flex-1 text-left truncate">{item.label}</span>
          </Button>
        );

        return item.hoverContent ? (
          <HoverCard
            key={index}
            title={item.hoverContent.title}
            description={item.hoverContent.description}
            videoUrl={item.hoverContent.videoUrl}
            placement="right"
            onOpenChange={(open) => onHoverCardStateChange?.(open)}
          >
            {button}
          </HoverCard>
        ) : (
          button
        );
      })}
    </div>
  );
};
