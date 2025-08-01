import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useFrontPageStoreShallow,
  useChatStoreShallow,
  usePilotStoreShallow,
  useCanvasStoreShallow,
  type MediaQueryData,
} from '@refly/stores';
import { genActionResultID } from '@refly/utils/id';
import { useInvokeAction } from '@refly-packages/ai-workspace-common/hooks/canvas/use-invoke-action';
import { useAddNode } from '@refly-packages/ai-workspace-common/hooks/canvas/use-add-node';
import getClient from '@refly-packages/ai-workspace-common/requests/proxiedRequest';
import {
  CreatePilotSessionRequest,
  ModelInfo,
  Skill,
  SkillRuntimeConfig,
  SkillTemplateConfig,
} from '@refly/openapi-schema';
import { message } from 'antd';
import { nodeOperationsEmitter } from '@refly-packages/ai-workspace-common/events/nodeOperations';

export const useCanvasInitialActions = (canvasId: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addNode } = useAddNode();
  const { invokeAction } = useInvokeAction({ source: 'canvas-initial-actions' });
  const { query, selectedSkill, runtimeConfig, tplConfig, reset, mediaQueryData } =
    useFrontPageStoreShallow((state) => ({
      query: state.query,
      selectedSkill: state.selectedSkill,
      runtimeConfig: state.runtimeConfig,
      tplConfig: state.tplConfig,
      reset: state.reset,
      mediaQueryData: state.mediaQueryData,
    }));
  const { canvasInitialized } = useCanvasStoreShallow((state) => ({
    canvasInitialized: state.canvasInitialized[canvasId],
  }));

  const { skillSelectedModel } = useChatStoreShallow((state) => ({
    skillSelectedModel: state.skillSelectedModel,
  }));
  const { setActiveSessionId, setIsPilotOpen } = usePilotStoreShallow((state) => ({
    setActiveSessionId: state.setActiveSessionId,
    setIsPilotOpen: state.setIsPilotOpen,
  }));

  // Store the required data to execute actions after connection
  const pendingActionRef = useRef<{
    source: string | null;
    query: string;
    selectedSkill: Skill;
    modelInfo: ModelInfo;
    tplConfig: SkillTemplateConfig;
    runtimeConfig: SkillRuntimeConfig;
    isPilotActivated?: boolean;
    isMediaGeneration?: boolean;
    mediaQueryData?: MediaQueryData;
  } | null>(null);

  // Store parameters needed for actions when URL parameters are processed
  useEffect(() => {
    const source = searchParams.get('source');
    const isPilotActivated = Boolean(searchParams.get('isPilotActivated'));
    const isMediaGeneration = Boolean(searchParams.get('isMediaGeneration'));
    const newParams = new URLSearchParams();

    // Copy all params except 'source'
    for (const [key, value] of searchParams.entries()) {
      if (!['source', 'isPilotActivated', 'isMediaGeneration'].includes(key)) {
        newParams.append(key, value);
      }
    }
    setSearchParams(newParams);

    // Store the data if we need to execute actions
    if (source === 'front-page' && query?.trim() && canvasId) {
      pendingActionRef.current = {
        source,
        query,
        selectedSkill,
        modelInfo: skillSelectedModel,
        tplConfig,
        runtimeConfig,
        isPilotActivated,
        isMediaGeneration,
        mediaQueryData,
      };
    }
  }, [
    canvasId,
    query,
    selectedSkill,
    searchParams,
    skillSelectedModel,
    tplConfig,
    runtimeConfig,
    mediaQueryData,
  ]);

  const handleCreatePilotSession = useCallback(async (param: CreatePilotSessionRequest) => {
    const { data, error } = await getClient().createPilotSession({
      body: param,
    });
    if (error) {
      message.error('Failed to create pilot session');
      return;
    }

    if (data.data?.sessionId) {
      setActiveSessionId(data.data?.sessionId);
      setIsPilotOpen(true);
    } else {
      message.error('Failed to create pilot session');
    }
  }, []);

  useEffect(() => {
    // Only proceed if we're connected and have pending actions
    if (canvasInitialized && pendingActionRef.current && canvasId) {
      const {
        query,
        selectedSkill,
        modelInfo,
        tplConfig,
        runtimeConfig,
        isPilotActivated,
        isMediaGeneration,
        mediaQueryData: pendingMediaQueryData,
      } = pendingActionRef.current;

      if (isMediaGeneration) {
        if (!pendingMediaQueryData) {
          return;
        }

        const { mediaType, query, model, providerItemId } = pendingMediaQueryData;
        nodeOperationsEmitter.emit('generateMedia', {
          providerItemId,
          targetType: 'canvas',
          targetId: canvasId,
          mediaType: mediaType,
          query: query,
          model: model,
          nodeId: '',
        });
      } else {
        if (isPilotActivated) {
          handleCreatePilotSession({
            targetId: canvasId,
            targetType: 'canvas',
            title: query,
            input: { query },
            maxEpoch: 3,
            // providerItemId: modelInfo.providerItemId,
          });
          pendingActionRef.current = null;

          return;
        }

        const resultId = genActionResultID();
        invokeAction(
          {
            query,
            resultId,
            selectedSkill,
            modelInfo,
            tplConfig,
            runtimeConfig,
          },
          {
            entityId: canvasId,
            entityType: 'canvas',
          },
        );
        addNode({
          type: 'skillResponse',
          data: {
            title: query,
            entityId: resultId,
            metadata: {
              status: 'executing',
              selectedSkill,
              modelInfo,
              runtimeConfig,
              tplConfig,
              structuredData: {
                query,
              },
            },
          },
        });
      }

      reset();
      pendingActionRef.current = null;
    }
  }, [canvasId, canvasInitialized, invokeAction, addNode, reset]);
};
