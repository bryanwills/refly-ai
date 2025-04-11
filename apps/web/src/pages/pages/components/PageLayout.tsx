import React, { ReactNode } from 'react';
import { Layout, Button, Tooltip } from 'antd';
import { UnorderedListOutlined, MenuUnfoldOutlined, LeftOutlined } from '@ant-design/icons';
import { SidebarMinimap } from './SidebarMinimap';
import { type NodeRelation } from './ArtifactRenderer';
import { useTranslation } from 'react-i18next';

interface PageLayoutProps {
  children: ReactNode;
  showMinimap: boolean;
  collapse: boolean;
  nodes: NodeRelation[];
  activeNodeIndex: number;
  headerContent?: ReactNode;
  readonly?: boolean;
  onNodeSelect: (index: number) => void;
  onReorderNodes?: (newOrder: NodeRelation[]) => void;
  toggleMinimap: () => void;
  toggleSidebar: () => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showMinimap,
  collapse,
  nodes,
  activeNodeIndex,
  headerContent,
  readonly = false,
  onNodeSelect,
  onReorderNodes,
  toggleMinimap,
  toggleSidebar,
}) => {
  const { t } = useTranslation();

  return (
    <Layout className="h-screen overflow-hidden bg-[#f7f9fc]">
      {/* 顶部导航栏 */}
      {headerContent && (
        <div className="flex justify-between items-center px-4 py-2.5 bg-white border-b border-gray-200 z-20 shadow-sm">
          {headerContent}
        </div>
      )}

      {/* 主体内容区 */}
      <Layout className="flex-1 overflow-hidden">
        {/* 左侧缩略图面板 */}
        {showMinimap && (
          <Layout.Sider
            width={180}
            theme="light"
            className="bg-[#f7f9fc] border-r border-gray-200 overflow-hidden relative"
          >
            <SidebarMinimap
              nodes={nodes}
              activeNodeIndex={activeNodeIndex}
              onNodeSelect={onNodeSelect}
              onReorderNodes={onReorderNodes || (() => {})}
              readonly={!!readonly} // Fix readonly property
            />
            {/* 隐藏小地图的按钮 */}
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={toggleMinimap}
              className="absolute top-2 right-2 z-10 bg-white shadow-sm hover:bg-gray-100 border border-gray-200 rounded-full h-6 w-6 flex items-center justify-center p-0"
              size="small"
            />
          </Layout.Sider>
        )}

        {/* 中间内容区域 */}
        <Layout.Content
          className="relative overflow-y-auto overflow-x-hidden"
          style={{ backgroundColor: '#f7f9fc' }}
        >
          {/* 显示小地图的按钮 */}
          {!showMinimap && (
            <div className="absolute left-0 top-14 z-10">
              <Tooltip title={t('pages.preview.navigationDirectory')} placement="right">
                <Button
                  type="default"
                  icon={<UnorderedListOutlined />}
                  onClick={toggleMinimap}
                  className="bg-white shadow-md rounded-r-md border-l-0 h-8 hover:bg-gray-50 border border-gray-200"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                />
              </Tooltip>
            </div>
          )}

          {/* 展开全局侧边栏的按钮 */}
          {collapse && (
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={toggleSidebar}
              className="absolute top-4 right-4 z-10 bg-white shadow-sm hover:bg-gray-100 border border-gray-200 h-8 w-8 flex items-center justify-center p-0 rounded-md"
            />
          )}

          <div className="mx-auto py-4 px-8 mb-16" style={{ maxWidth: '900px' }}>
            {children}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
