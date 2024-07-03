// This file is auto-generated by @hey-api/openapi-ts

/**
 * Resource metadata
 */
export type ResourceMeta = {
  /**
   * Weblink URL
   */
  url?: string;
  /**
   * Weblink title
   */
  title?: string;
  /**
   * Weblink ID (if it already exists)
   */
  linkId?: string;
  /**
   * Storage key for the weblink
   * @deprecated
   */
  storageKey?: string;
};

/**
 * Resource type
 */
export type ResourceType = 'weblink' | 'note';

export type Resource = {
  /**
   * Resource ID
   */
  resourceId: string;
  /**
   * Resource type
   */
  resourceType: ResourceType;
  /**
   * Collection ID
   * @deprecated
   */
  collectionId?: string;
  /**
   * Resource title
   */
  title: string;
  /**
   * Resource description
   */
  description?: string;
  /**
   * Resource metadata
   */
  data?: ResourceMeta;
  /**
   * Resource index status
   */
  indexStatus: IndexStatus;
  /**
   * Whether this resource is public
   */
  isPublic: boolean;
  /**
   * Whether this resource is read-only
   */
  readOnly: boolean;
  /**
   * Whether this resource is collaborative
   */
  collabEnabled: boolean;
  /**
   * Collection creation time
   */
  createdAt: string;
  /**
   * Collection creation time
   */
  updatedAt: string;
  /**
   * Document content for this resource
   */
  doc?: string;
};

export type Collection = {
  /**
   * Collection ID
   */
  collectionId: string;
  /**
   * Collection title
   */
  title: string;
  /**
   * Collection description
   */
  description?: string;
  /**
   * Whether this collection is public
   */
  isPublic?: boolean;
  /**
   * Collection creation time
   */
  createdAt: string;
  /**
   * Collection creation time
   */
  updatedAt: string;
  /**
   * Collection resources (only returned in detail API)
   */
  resources?: Array<Resource>;
};

/**
 * Skill template
 */
export type SkillTemplate = {
  /**
   * Skill template name
   */
  name?: string;
  /**
   * Skill display name (key is locale and value is display name)
   */
  displayName?: {
    [key: string]: unknown;
  };
  /**
   * Skill description
   */
  description?: string;
  /**
   * JSON schema for config
   */
  configSchema?: {
    [key: string]: unknown;
  };
};

/**
 * Skill trigger event
 */
export type SkillTriggerEvent = 'resourceAdd' | 'resourceUpdate' | 'collectionAdd' | 'collectionUpdate' | 'cron';

/**
 * Skill triggers
 */
export type SkillTrigger = {
  /**
   * Skill ID
   */
  skillId: string;
  /**
   * Trigger ID
   */
  triggerId: string;
  /**
   * Trigger event
   */
  event: SkillTriggerEvent;
  /**
   * Cron expression
   */
  crontab?: string;
  /**
   * Trigger enabled
   */
  enabled: boolean;
  /**
   * Trigger creation time
   */
  createdAt: string;
  /**
   * Trigger update time
   */
  updatedAt: string;
};

/**
 * Skill metadata
 */
export type SkillMeta = {
  /**
   * Skill name
   */
  skillName: string;
  /**
   * Skill display name
   */
  skillDisplayName?: string;
  /**
   * Skill ID
   */
  skillId?: string;
};

/**
 * Skill
 */
export type SkillInstance = SkillMeta & {
  /**
   * Skill triggers
   */
  triggers?: Array<SkillTrigger>;
  /**
   * Skill config
   */
  config?: string;
  /**
   * Skill creation time
   */
  createdAt?: string;
  /**
   * Skill update time
   */
  updatedAt?: string;
} & {
  /**
   * Skill ID
   */
  skillId: string;
  /**
   * Skill creation time
   */
  createdAt: string;
  /**
   * Skill update time
   */
  updatedAt: string;
};

/**
 * Skill operation log
 */
export type SkillLog = {
  /**
   * Log ID
   */
  logId: string;
  /**
   * Skill ID
   */
  skillId: string;
  /**
   * Skill name
   */
  skillName: string;
  /**
   * Skill trigger ID
   */
  triggerId?: string;
  /**
   * Skill input
   */
  input: SkillInput;
  /**
   * Skill context
   */
  context: SkillContext;
  /**
   * Log creation time
   */
  createdAt: string;
  /**
   * Log update time
   */
  updatedAt: string;
};

/**
 * Source metadata
 */
export type SourceMeta = {
  /**
   * Source URL
   */
  source?: string;
  /**
   * Source title
   */
  title?: string;
  /**
   * Source publish time
   */
  publishedTime?: string;
  /**
   * Related collection ID
   */
  collectionId?: string;
  /**
   * Related collection name
   */
  collectionName?: string;
  /**
   * Related resource ID
   */
  resourceId?: string;
  /**
   * Related resource name
   */
  resourceName?: string;
};

/**
 * Source selection
 */
export type SourceSelection = {
  /**
   * Selected xPath
   * @deprecated
   */
  xPath?: string;
  /**
   * Selected content
   */
  content: string;
  /**
   * Selection type
   */
  type: 'text' | 'table' | 'link' | 'image' | 'video' | 'audio';
};

/**
 * Selection type
 */
export type type = 'text' | 'table' | 'link' | 'image' | 'video' | 'audio';

/**
 * Source of the message
 */
export type Source = {
  /**
   * Source URL
   */
  url?: string;
  /**
   * Source title
   */
  title?: string;
  /**
   * Source content
   */
  pageContent: string;
  /**
   * Relativity score
   */
  score?: number;
  /**
   * Source metadata
   * @deprecated
   */
  metadata?: SourceMeta;
  /**
   * Source selections
   */
  selections?: Array<SourceSelection>;
};

/**
 * Chat message type
 */
export type MessageType = 'ai' | 'human' | 'system';

/**
 * Chat message
 */
export type ChatMessage = {
  /**
   * Message ID
   */
  readonly msgId: string;
  /**
   * Message type
   */
  type: MessageType;
  /**
   * Message content
   */
  content: string;
  /**
   * Skill metadata
   */
  skillMeta?: SkillMeta;
  /**
   * Message logs
   */
  logs?: Array<string>;
  /**
   * Structured data output
   */
  structuredData?: {
    [key: string]: unknown;
  };
  /**
   * Related questions
   * @deprecated
   */
  relatedQuestions?: Array<string>;
  /**
   * Related sources
   * @deprecated
   */
  sources?: Array<Source>;
  /**
   * Selected weblink config (JSON)
   */
  selectedWeblinkConfig?: string;
  /**
   * Message creation time
   */
  createdAt?: string;
  /**
   * Message update time
   */
  updatedAt?: string;
};

/**
 * Conversation list item
 */
export type Conversation = {
  /**
   * Conversation ID
   */
  convId?: string;
  /**
   * Conversation title
   */
  title?: string;
  /**
   * Last message content
   */
  lastMessage?: string;
  /**
   * Number of chat messages in this conversation
   */
  messageCount?: number;
  /**
   * Related content ID
   */
  cid?: string;
  /**
   * Conversation locale
   */
  locale?: string;
  /**
   * Origin page host
   */
  origin?: string;
  /**
   * Origin page title
   */
  originPageTitle?: string;
  /**
   * Origin page url
   */
  originPageUrl?: string;
  /**
   * Conversation creation time
   */
  createdAt?: string;
  /**
   * Conversation creation time
   */
  updatedAt?: string;
  /**
   * Conversation messages (only returned for getConversationDetail api)
   */
  messages?: Array<ChatMessage>;
};

/**
 * Chat task type
 */
export type ChatTaskType =
  | 'chat'
  | 'genTitle'
  | 'quickAction'
  | 'searchEnhanceKeyword'
  | 'searchEnhanceSummarize'
  | 'searchEnhanceAsk';

/**
 * Content retrieval filter
 */
export type RetrieveFilter = {
  /**
   * List of web links
   * @deprecated
   */
  weblinkList?: Array<Source>;
  /**
   * List of URLs to retrieve
   */
  urls?: Array<string>;
  /**
   * List of resource IDs to retrieve
   */
  resourceIds?: Array<string>;
  /**
   * List of collection IDs to retrieve
   */
  collectionIds?: Array<string>;
};

/**
 * Chat payload
 */
export type ChatPayload = {
  /**
   * Question
   */
  question: string;
  /**
   * Content retrieval filter
   */
  filter?: RetrieveFilter;
};

/**
 * Quick action type
 */
export type QuickActionType = 'selection' | 'summary';

/**
 * Quick action task payload
 */
export type QuickActionTaskPayload = {
  /**
   * Question
   */
  question?: string;
  /**
   * Quick action type
   */
  actionType?: QuickActionType;
  /**
   * Prompt for this action
   */
  actionPrompt?: string;
  /**
   * Reference for this action
   */
  reference?: string;
  /**
   * Content retrieval filter
   */
  filter?: RetrieveFilter;
};

/**
 * Chat task
 */
export type ChatTask = {
  /**
   * Task type
   */
  taskType: ChatTaskType;
  /**
   * Whether to dry run the task
   */
  dryRun?: boolean;
  /**
   * Conversation ID, a new conversation will be created if empty or non-existent
   */
  convId?: string;
  /**
   * Create conversation parameters
   */
  createConvParam?: CreateConversationRequest;
  /**
   * Chat locale
   */
  locale?: string;
  /**
   * Chat data
   */
  data?: ChatPayload | QuickActionTaskPayload;
};

/**
 * Chat task response
 */
export type ChatTaskResponse = {
  /**
   * List of web links
   */
  sources: Array<Source>;
  /**
   * Chat Answer
   */
  answer: string;
  /**
   * Related questions
   */
  relatedQuestions?: Array<string>;
};

/**
 * Resource index status
 */
export type IndexStatus = 'init' | 'processing' | 'finish' | 'failed' | 'unavailable';

/**
 * Weblink parse source
 */
export type ParseSource = 'serverCrawl' | 'clientUpload';

export type PingWeblinkData = {
  /**
   * Weblink ID
   */
  linkId?: string;
  /**
   * Weblink parse status
   */
  parseStatus?: IndexStatus;
  /**
   * Weblink chunking status
   */
  chunkStatus?: IndexStatus;
  /**
   * Summary of the weblink
   */
  summary?: string;
  /**
   * Related questions for this weblink summary
   */
  relatedQuestions?: Array<string>;
  /**
   * Weblink parse source
   */
  parseSource?: ParseSource;
};

export type Weblink = {
  /**
   * Weblink ID
   */
  linkId?: string;
  /**
   * Weblink URL
   */
  url?: string;
  /**
   * Weblink title
   */
  title?: string;
  /**
   * Weblink document storage key
   */
  storageKey?: string;
  /**
   * Origin page host
   */
  origin?: string;
  /**
   * Origin page title
   */
  originPageTitle?: string;
  /**
   * Origin page url
   */
  originPageUrl?: string;
  /**
   * Origin page description
   */
  originPageDescription?: string;
  /**
   * Weblink visit count
   */
  visitCount?: number;
  /**
   * UNIX timestamp for last visit time
   */
  lastVisitTime?: number;
  /**
   * Read time in seconds
   */
  readTime?: number;
  /**
   * Weblink index status
   */
  indexStatus?: IndexStatus;
  /**
   * Weblink creation time
   */
  createdAt?: string;
  /**
   * Weblink update time
   */
  updatedAt?: string;
};

export type Content = {
  /**
   * Content ID
   */
  cid: string;
  /**
   * Content ID
   */
  contentId: string;
  /**
   * Content title
   */
  title: string;
  /**
   * Content abstract
   */
  abstract?: string;
  /**
   * Content metadata
   */
  meta?: string;
  /**
   * Content creation time
   */
  createdAt: string;
  /**
   * Content update time
   */
  updatedAt: string;
};

export type ContentMetaRecord = {
  /**
   * Meta key
   */
  key: string;
  /**
   * Meta name
   */
  name: string;
  /**
   * Meta relativity score
   */
  score: number;
  /**
   * Reason for classification
   */
  reason: string;
};

export type ContentMeta = {
  /**
   * Topic list
   */
  topics?: Array<ContentMetaRecord>;
  /**
   * Content type list
   */
  contentType?: Array<ContentMetaRecord>;
  /**
   * Content format list
   */
  formats?: Array<ContentMetaRecord>;
};

export type ContentDetail = Content & {
  /**
   * Content
   */
  content?: string;
  /**
   * Content source list (JSON)
   */
  sources?: string;
  /**
   * Content input list
   */
  inputs?: Array<ContentDetail>;
  /**
   * Content metadata
   */
  meta?: ContentMeta;
};

export type Digest = Content & {
  /**
   * Topic key
   */
  topicKey: string;
  /**
   * User ID
   */
  uid?: string;
  /**
   * Digest date
   */
  date: string;
};

export type Feed = Content & {
  /**
   * Read count
   */
  readCount?: number;
  /**
   * Ask follow count
   */
  askFollow?: number;
};

export type UserSettings = {
  /**
   * User ID
   */
  uid: string;
  /**
   * User avatar
   */
  avatar: string;
  /**
   * User name
   */
  name: string;
  /**
   * User email
   */
  email: string;
  /**
   * Whether email is verified
   */
  emailVerified?: boolean;
  /**
   * User UI locale
   */
  uiLocale?: string;
  /**
   * User output locale
   */
  outputLocale?: string;
};

export type TopicMeta = {
  /**
   * Topic ID
   */
  topicId?: string;
  /**
   * Topic key
   */
  key?: string;
  /**
   * Topic name
   */
  name?: string;
  /**
   * Topic description
   */
  description?: string;
  /**
   * Topic creation time
   */
  createdAt?: string;
  /**
   * Topic update time
   */
  updatedAt?: string;
};

export type Topic = {
  /**
   * Topic ID
   * @deprecated
   */
  id?: number;
  /**
   * Topic score
   */
  score: number;
  /**
   * Topic key
   */
  topicKey: string;
  /**
   * Topic meta
   */
  topic: TopicMeta;
  /**
   * Topic creation time
   */
  createdAt: string;
  /**
   * Topic update time
   */
  updatedAt: string;
};

export type UserTopics = {
  /**
   * Topic list
   */
  list?: Array<Topic>;
  /**
   * Total count of topics
   */
  total: number;
};

export type BaseResponse = {
  /**
   * Whether the operation was successful
   */
  success: boolean;
  /**
   * Error message
   */
  errMsg?: string;
};

export type UpsertResourceRequest = {
  /**
   * Resource type
   */
  resourceType: ResourceType;
  /**
   * Resource title
   */
  title?: string;
  /**
   * Resource ID (only used for update)
   */
  resourceId?: string;
  /**
   * Collection ID (will create new collection if empty)
   */
  collectionId?: string;
  /**
   * Collection name
   */
  collectionName?: string;
  /**
   * Resource metadata
   */
  data: ResourceMeta;
  /**
   * Storage key for the resource
   */
  storageKey?: string;
  /**
   * Resource content (this will be ignored if storageKey was set)
   */
  content?: string;
  /**
   * Whether this resource is public
   */
  isPublic?: boolean;
  /**
   * Whether this resource is read-only
   */
  readOnly?: boolean;
};

export type UpsertResourceResponse = BaseResponse & {
  data?: Resource;
};

export type DeleteResourceRequest = {
  /**
   * Resource ID to delete
   */
  resourceId: string;
};

export type ListResourceResponse = BaseResponse & {
  /**
   * Resource list
   */
  data?: Array<Resource>;
};

export type GetResourceDetailResponse = BaseResponse & {
  /**
   * Resource data
   */
  data?: Resource;
};

export type UpsertCollectionRequest = {
  /**
   * Collection ID (only used for update)
   */
  collectionId?: string;
  /**
   * Collection title
   */
  title?: string;
  /**
   * Collection description
   */
  description?: string;
  /**
   * Whether this collection is public
   */
  isPublic?: boolean;
};

export type UpsertCollectionResponse = BaseResponse & {
  data?: Collection;
};

export type DeleteCollectionRequest = {
  /**
   * Collection ID to delete
   */
  collectionId: string;
};

export type ListCollectionResponse = BaseResponse & {
  /**
   * Collection list
   */
  data?: Array<Collection>;
};

export type GetCollectionDetailResponse = BaseResponse & {
  /**
   * Collection data
   */
  data?: Collection;
};

export type ListSkillTemplateResponse = BaseResponse & {
  /**
   * Skill template list
   */
  data?: Array<SkillTemplate>;
};

export type ListSkillInstanceResponse = BaseResponse & {
  /**
   * Skill list
   */
  data?: Array<SkillInstance>;
};

export type UpsertSkillInstanceRequest = {
  /**
   * Skill name
   */
  skillName: string;
  /**
   * Skill display name
   */
  displayName: string;
  /**
   * Skill ID (only used for update)
   */
  skillId?: string;
  /**
   * Skill triggers
   */
  triggers?: Array<UpsertSkillTriggerRequest>;
  /**
   * Skill config (should conform to template config schema)
   */
  config?: {
    [key: string]: unknown;
  };
};

export type UpsertSkillInstanceResponse = BaseResponse & {
  data?: SkillInstance;
};

export type DeleteSkillInstanceRequest = {
  /**
   * Skill ID to delete
   */
  skillId: string;
};

/**
 * Skill input
 */
export type SkillInput = {
  /**
   * User query
   */
  query: string;
};

/**
 * Skill invocation context
 */
export type SkillContext = {
  /**
   * User input locale
   */
  locale?: string;
  /**
   * List of resource IDs
   */
  resourceIds?: Array<string>;
  /**
   * List of collection IDs
   */
  collectionIds?: Array<string>;
  /**
   * List of content
   */
  contentList?: Array<string>;
};

export type InvokeSkillRequest = {
  /**
   * Skill input
   */
  input: SkillInput;
  /**
   * Skill invocation context
   */
  context?: SkillContext;
  /**
   * Skill instance ID to invoke (if not provided, skill scheduler will be used)
   */
  skillId?: string;
  /**
   * Skill trigger event
   */
  event?: SkillTriggerEvent;
  /**
   * Skill config (should conform to template config schema)
   */
  config?: {
    [key: string]: unknown;
  };
  /**
   * Conversation ID (will add messages to this conversation if provided)
   */
  convId?: string;
  /**
   * Create conversation parameters
   */
  createConvParam?: CreateConversationRequest;
};

export type InvokeSkillResponse = BaseResponse & {
  /**
   * Skill log id
   */
  logId?: string;
};

export type ListSkillTriggerResponse = BaseResponse & {
  /**
   * Skill trigger list
   */
  data?: Array<SkillTrigger>;
};

export type UpsertSkillTriggerRequest = {
  /**
   * Skill ID (only used for updating triggers or adding triggers to an existing skill)
   */
  skillId?: string;
  /**
   * Trigger ID (only used for update)
   */
  triggerId?: string;
  /**
   * Trigger event
   */
  event: SkillTriggerEvent;
  /**
   * Trigger crontab (only valid when event is `cron`)
   */
  crontab?: string;
  /**
   * Whether this trigger is enabled
   */
  enabled?: boolean;
};

export type UpsertSkillTriggerResponse = BaseResponse & {
  data?: SkillTrigger;
};

export type DeleteSkillTriggerRequest = {
  /**
   * Trigger ID to delete
   */
  triggerId: string;
};

export type ListSkillLogResponse = BaseResponse & {
  /**
   * Skill log list
   */
  data?: Array<SkillLog>;
};

export type CreateConversationRequest = {
  /**
   * Conversation title
   */
  title?: string;
  /**
   * Related content ID
   */
  cid?: string;
  /**
   * Related link ID
   */
  linkId?: string;
  /**
   * Conversation locale
   */
  locale?: string;
  /**
   * Origin page host
   */
  origin?: string;
  /**
   * Origin page title
   */
  originPageTitle?: string;
  /**
   * Origin page url
   */
  originPageUrl?: string;
};

export type CreateConversationResponse = BaseResponse & {
  /**
   * Created conversation
   */
  data?: Conversation;
};

export type ListConversationResponse = BaseResponse & {
  /**
   * Conversation list
   */
  data?: Array<Conversation>;
};

export type ChatRequest = {
  /**
   * chat task config
   */
  task?: ChatTask;
};

export type GetConversationDetailResponse = BaseResponse & {
  /**
   * Conversation data
   */
  data?: Conversation;
};

export type PingWeblinkResponse = BaseResponse & {
  /**
   * Weblink ping result
   */
  data?: PingWeblinkData;
};

export type StoreWeblinkRequest = {
  /**
   * Weblink list
   */
  data?: Array<Weblink>;
};

export type ListWeblinkResponse = BaseResponse & {
  /**
   * Weblink list
   */
  data?: Array<Weblink>;
};

export type ListFeedResponse = BaseResponse & {
  /**
   * Feed list
   */
  data?: Array<Feed>;
};

export type ListDigestRequest = {
  /**
   * Page number
   */
  page?: number;
  /**
   * Page size
   */
  pageSize?: number;
  /**
   * Digest query filter
   */
  filter?: {
    /**
     * Date filter
     */
    date?: {
      /**
       * Year
       */
      year?: number;
      /**
       * Month
       */
      month?: number;
      /**
       * Day
       */
      day?: number;
    };
    /**
     * Topic filter
     */
    topic?: string;
  };
};

export type ListDigestResponse = BaseResponse & {
  /**
   * Digest list
   */
  data?: Array<Digest>;
};

export type GetContentDetailResponse = BaseResponse & {
  /**
   * Content data
   */
  data?: ContentDetail;
};

export type UpdateUserSettingsRequest = {
  /**
   * UI locale
   */
  uiLocale?: string;
  /**
   * Output locale
   */
  outputLocale?: string;
};

export type GetUserTopicsResponse = BaseResponse & {
  /**
   * User topics
   */
  data?: UserTopics;
};

export type ListResourcesData = {
  query?: {
    /**
     * Target collection ID
     */
    collectionId?: string;
    /**
     * Page number
     */
    page?: number;
    /**
     * Page size
     */
    pageSize?: number;
    /**
     * Resource ID
     */
    resourceId?: string;
  };
};

export type ListResourcesResponse = ListResourceResponse;

export type ListResourcesError = unknown;

export type GetResourceDetailData = {
  query: {
    /**
     * Resource ID to retrieve
     */
    resourceId: string;
  };
};

export type GetResourceDetailResponse2 = GetResourceDetailResponse;

export type GetResourceDetailError = unknown;

export type UpdateResourceData = {
  /**
   * Resource update request
   */
  body: UpsertResourceRequest;
};

export type UpdateResourceResponse = UpsertResourceResponse;

export type UpdateResourceError = unknown;

export type CreateResourceData = {
  /**
   * Resource creation request
   */
  body: UpsertResourceRequest;
};

export type CreateResourceResponse = UpsertResourceResponse;

export type CreateResourceError = unknown;

export type DeleteResourceData = {
  body: DeleteResourceRequest;
};

export type DeleteResourceResponse = BaseResponse;

export type DeleteResourceError = unknown;

export type ListCollectionsData = {
  query?: {
    /**
     * Page number
     */
    page?: number;
    /**
     * Page size
     */
    pageSize?: number;
  };
};

export type ListCollectionsResponse = ListCollectionResponse;

export type ListCollectionsError = unknown;

export type GetCollectionDetailData = {
  query: {
    /**
     * Collection ID to retrieve
     */
    collectionId: string;
  };
};

export type GetCollectionDetailResponse2 = GetCollectionDetailResponse;

export type GetCollectionDetailError = unknown;

export type UpdateCollectionData = {
  /**
   * Collection update request
   */
  body: UpsertCollectionRequest;
};

export type UpdateCollectionResponse = BaseResponse;

export type UpdateCollectionError = unknown;

export type CreateCollectionData = {
  /**
   * Collection creation request
   */
  body: UpsertCollectionRequest;
};

export type CreateCollectionResponse = BaseResponse;

export type CreateCollectionError = unknown;

export type DeleteCollectionData = {
  body: DeleteCollectionRequest;
};

export type DeleteCollectionResponse = BaseResponse;

export type DeleteCollectionError = unknown;

export type ListSkillTemplatesData = {
  query?: {
    /**
     * Page number
     */
    page?: number;
    /**
     * Page size
     */
    pageSize?: number;
  };
};

export type ListSkillTemplatesResponse = ListSkillTemplateResponse;

export type ListSkillTemplatesError = unknown;

export type ListSkillInstancesData = {
  query?: {
    /**
     * Page number
     */
    page?: number;
    /**
     * Page size
     */
    pageSize?: number;
    /**
     * Skill ID
     */
    skillId?: string;
  };
};

export type ListSkillInstancesResponse = ListSkillInstanceResponse;

export type ListSkillInstancesError = unknown;

export type CreateSkillInstanceData = {
  /**
   * Skill creation request
   */
  body: UpsertSkillInstanceRequest;
};

export type CreateSkillInstanceResponse = UpsertSkillInstanceResponse;

export type CreateSkillInstanceError = unknown;

export type UpdateSkillInstanceData = {
  /**
   * Skill update request
   */
  body: UpsertSkillInstanceRequest;
};

export type UpdateSkillInstanceResponse = UpsertSkillInstanceResponse;

export type UpdateSkillInstanceError = unknown;

export type DeleteSkillInstanceData = {
  body: DeleteSkillInstanceRequest;
};

export type DeleteSkillInstanceResponse = BaseResponse;

export type DeleteSkillInstanceError = unknown;

export type InvokeSkillData = {
  /**
   * Skill invocation request
   */
  body: InvokeSkillRequest;
};

export type InvokeSkillResponse2 = InvokeSkillResponse;

export type InvokeSkillError = unknown;

export type StreamInvokeSkillData = {
  /**
   * Skill invocation request
   */
  body: InvokeSkillRequest;
};

export type StreamInvokeSkillResponse = string;

export type StreamInvokeSkillError = unknown;

export type ListSkillTriggersData = {
  query?: {
    /**
     * Page number
     */
    page?: number;
    /**
     * Page size
     */
    pageSize?: number;
    /**
     * Skill ID
     */
    skillId?: string;
  };
};

export type ListSkillTriggersResponse = ListSkillTriggerResponse;

export type ListSkillTriggersError = unknown;

export type CreateSkillTriggerData = {
  /**
   * Skill trigger creation request
   */
  body: UpsertSkillTriggerRequest;
};

export type CreateSkillTriggerResponse = BaseResponse;

export type CreateSkillTriggerError = unknown;

export type UpdateSkillTriggerData = {
  /**
   * Skill trigger update request
   */
  body: UpsertSkillTriggerRequest;
};

export type UpdateSkillTriggerResponse = BaseResponse;

export type UpdateSkillTriggerError = unknown;

export type DeleteSkillTriggerData = {
  body: DeleteSkillTriggerRequest;
};

export type DeleteSkillTriggerResponse = BaseResponse;

export type DeleteSkillTriggerError = unknown;

export type ListSkillLogsData = {
  query?: {
    /**
     * Page number
     */
    page?: number;
    /**
     * Page size
     */
    pageSize?: number;
    /**
     * Skill ID
     */
    skillId?: string;
  };
};

export type ListSkillLogsResponse = ListSkillLogResponse;

export type ListSkillLogsError = unknown;

export type ListConversationsResponse = ListConversationResponse;

export type ListConversationsError = unknown;

export type ChatData = {
  /**
   * Chat request
   */
  body: ChatRequest;
};

export type ChatResponse = string;

export type ChatError = unknown;

export type CreateConversationData = {
  /**
   * Conversation creation request
   */
  body: CreateConversationRequest;
};

export type CreateConversationResponse2 = CreateConversationResponse;

export type CreateConversationError = unknown;

export type GetConversationDetailData = {
  path: {
    /**
     * Conversation ID
     */
    convId: string;
  };
};

export type GetConversationDetailResponse2 = GetConversationDetailResponse;

export type GetConversationDetailError = unknown;

export type PingWeblinkData2 = {
  query: {
    /**
     * Weblink URL
     */
    url: string;
  };
};

export type PingWeblinkResponse2 = PingWeblinkResponse;

export type PingWeblinkError = unknown;

export type StoreWeblinkData = {
  body: StoreWeblinkRequest;
};

export type StoreWeblinkResponse = BaseResponse;

export type StoreWeblinkError = unknown;

export type ListWeblinksData = {
  query?: {
    /**
     * Weblink ID
     */
    linkId?: string;
    /**
     * Page number
     */
    page?: number;
    /**
     * Page size
     */
    pageSize?: number;
    /**
     * Weblink URL
     */
    url?: string;
  };
};

export type ListWeblinksResponse = ListWeblinkResponse;

export type ListWeblinksError = unknown;

export type GetFeedListData = {
  query?: {
    /**
     * Page number
     */
    page?: number;
    /**
     * Page size
     */
    pageSize?: number;
  };
};

export type GetFeedListResponse = ListFeedResponse;

export type GetFeedListError = unknown;

export type GetDigestListData = {
  body: ListDigestRequest;
};

export type GetDigestListResponse = ListDigestResponse;

export type GetDigestListError = unknown;

export type GetContentDetailData = {
  path: {
    /**
     * Content ID
     */
    cid: string;
  };
};

export type GetContentDetailResponse2 = GetContentDetailResponse;

export type GetContentDetailError = unknown;

export type GetSettingsResponse = UserSettings;

export type GetSettingsError = unknown;

export type UpdateSettingsData = {
  body: UpdateUserSettingsRequest;
};

export type UpdateSettingsResponse = BaseResponse;

export type UpdateSettingsError = unknown;

export type GetUserTopicsResponse2 = GetUserTopicsResponse;

export type GetUserTopicsError = unknown;

export type $OpenApiTs = {
  '/knowledge/resource/list': {
    get: {
      req: ListResourcesData;
      res: {
        /**
         * Successful operation
         */
        '200': ListResourceResponse;
      };
    };
  };
  '/knowledge/resource/detail': {
    get: {
      req: GetResourceDetailData;
      res: {
        /**
         * successful operation
         */
        '200': GetResourceDetailResponse;
      };
    };
  };
  '/knowledge/resource/update': {
    post: {
      req: UpdateResourceData;
      res: {
        /**
         * successful operation
         */
        '200': UpsertResourceResponse;
      };
    };
  };
  '/knowledge/resource/new': {
    post: {
      req: CreateResourceData;
      res: {
        /**
         * successful operation
         */
        '200': UpsertResourceResponse;
      };
    };
  };
  '/knowledge/resource/delete': {
    post: {
      req: DeleteResourceData;
      res: {
        /**
         * Successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/knowledge/collection/list': {
    get: {
      req: ListCollectionsData;
      res: {
        /**
         * Successful operation
         */
        '200': ListCollectionResponse;
      };
    };
  };
  '/knowledge/collection/detail': {
    get: {
      req: GetCollectionDetailData;
      res: {
        /**
         * successful operation
         */
        '200': GetCollectionDetailResponse;
      };
    };
  };
  '/knowledge/collection/update': {
    post: {
      req: UpdateCollectionData;
      res: {
        /**
         * successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/knowledge/collection/new': {
    post: {
      req: CreateCollectionData;
      res: {
        /**
         * successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/knowledge/collection/delete': {
    post: {
      req: DeleteCollectionData;
      res: {
        /**
         * Successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/skill/template/list': {
    get: {
      req: ListSkillTemplatesData;
      res: {
        /**
         * successful operation
         */
        '200': ListSkillTemplateResponse;
      };
    };
  };
  '/skill/instance/list': {
    get: {
      req: ListSkillInstancesData;
      res: {
        /**
         * successful operation
         */
        '200': ListSkillInstanceResponse;
      };
    };
  };
  '/skill/instance/new': {
    post: {
      req: CreateSkillInstanceData;
      res: {
        /**
         * successful operation
         */
        '200': UpsertSkillInstanceResponse;
      };
    };
  };
  '/skill/instance/update': {
    post: {
      req: UpdateSkillInstanceData;
      res: {
        /**
         * successful operation
         */
        '200': UpsertSkillInstanceResponse;
      };
    };
  };
  '/skill/instance/delete': {
    post: {
      req: DeleteSkillInstanceData;
      res: {
        /**
         * successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/skill/invoke': {
    post: {
      req: InvokeSkillData;
      res: {
        /**
         * successful operation
         */
        '200': InvokeSkillResponse;
      };
    };
  };
  '/skill/streamInvoke': {
    post: {
      req: StreamInvokeSkillData;
      res: {
        /**
         * successful operation
         */
        '200': string;
      };
    };
  };
  '/skill/trigger/list': {
    get: {
      req: ListSkillTriggersData;
      res: {
        /**
         * successful operation
         */
        '200': ListSkillTriggerResponse;
      };
    };
  };
  '/skill/trigger/new': {
    post: {
      req: CreateSkillTriggerData;
      res: {
        /**
         * successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/skill/trigger/update': {
    post: {
      req: UpdateSkillTriggerData;
      res: {
        /**
         * successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/skill/trigger/delete': {
    post: {
      req: DeleteSkillTriggerData;
      res: {
        /**
         * successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/skill/log/list': {
    get: {
      req: ListSkillLogsData;
      res: {
        /**
         * successful operation
         */
        '200': ListSkillLogResponse;
      };
    };
  };
  '/conversation/list': {
    get: {
      res: {
        /**
         * successful operation
         */
        '200': ListConversationResponse;
      };
    };
  };
  '/conversation/chat': {
    post: {
      req: ChatData;
      res: {
        /**
         * successful operation
         */
        '200': string;
      };
    };
  };
  '/conversation/new': {
    post: {
      req: CreateConversationData;
      res: {
        /**
         * successful operation
         */
        '200': CreateConversationResponse;
      };
    };
  };
  '/conversation/{convId}': {
    get: {
      req: GetConversationDetailData;
      res: {
        /**
         * successful operation
         */
        '200': GetConversationDetailResponse;
      };
    };
  };
  '/weblink/ping': {
    get: {
      req: PingWeblinkData2;
      res: {
        /**
         * successful operation
         */
        '200': PingWeblinkResponse;
      };
    };
  };
  '/weblink/store': {
    post: {
      req: StoreWeblinkData;
      res: {
        /**
         * successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/weblink/list': {
    get: {
      req: ListWeblinksData;
      res: {
        /**
         * successful operation
         */
        '200': ListWeblinkResponse;
      };
    };
  };
  '/aigc/feed': {
    get: {
      req: GetFeedListData;
      res: {
        /**
         * successful operation
         */
        '200': ListFeedResponse;
      };
    };
  };
  '/aigc/digest': {
    post: {
      req: GetDigestListData;
      res: {
        /**
         * successful operation
         */
        '200': ListDigestResponse;
      };
    };
  };
  '/aigc/content/{cid}': {
    get: {
      req: GetContentDetailData;
      res: {
        /**
         * successful operation
         */
        '200': GetContentDetailResponse;
      };
    };
  };
  '/user/settings': {
    get: {
      res: {
        /**
         * successful operation
         */
        '200': UserSettings;
      };
    };
    put: {
      req: UpdateSettingsData;
      res: {
        /**
         * successful operation
         */
        '200': BaseResponse;
      };
    };
  };
  '/user/topics': {
    get: {
      res: {
        /**
         * successful operation
         */
        '200': GetUserTopicsResponse;
      };
    };
  };
};
