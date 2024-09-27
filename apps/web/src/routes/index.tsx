import { lazy, Suspense } from "react"
import { Route, Routes, useMatch } from "react-router-dom"
import { Spin } from "@arco-design/web-react"
import { useEffect } from "react"
import { safeParseJSON } from "@refly-packages/ai-workspace-common/utils/parse"
import { useUserStore } from "@refly-packages/ai-workspace-common/stores/user"
import { useTranslation } from "react-i18next"
import { useGetUserSettings } from "@refly-packages/ai-workspace-common/hooks/use-get-user-settings"
import { LOCALE } from "@refly/common-types"

// Lazy load components
const Workspace = lazy(() => import("@/pages/workspace"))
const ConvLibrary = lazy(() => import("@/pages/conv-library"))
const KnowledgeBase = lazy(() => import("@/pages/knowledge-base"))
const Skill = lazy(() => import("@/pages/skill"))
const SkillDetailPage = lazy(() => import("@/pages/skill-detail"))
const Login = lazy(() => import("@/pages/login"))

const Settings = lazy(() =>
  import("@refly-packages/ai-workspace-common/components/settings/index").then(
    module => ({ default: module.Settings }),
  ),
)

// Loading component
const LoadingFallback = () => (
  <div
    style={{
      height: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
    <Spin />
  </div>
)

const prefetchRoutes = () => {
  // Prefetch common routes
  import("@/pages/login")
  import("@/pages/workspace")
  import("@/pages/knowledge-base")
  import("@/pages/conv-library")
  import("@/pages/skill")
  import("@/pages/skill-detail")
}

export const AppRouter = (props: { layout?: any }) => {
  const { layout: Layout } = props
  const userStore = useUserStore()

  const { i18n } = useTranslation()
  const language = i18n.languages?.[0]

  // 获取 storage user profile
  const storageUserProfile = safeParseJSON(
    localStorage.getItem("refly-user-profile"),
  )
  const notShowLoginBtn = storageUserProfile?.uid || userStore?.userProfile?.uid

  // 获取 locale
  const storageLocalSettings = safeParseJSON(
    localStorage.getItem("refly-local-settings"),
  )
  const locale =
    storageLocalSettings?.uiLocale ||
    userStore?.localSettings?.uiLocale ||
    LOCALE.EN

  useEffect(() => {
    prefetchRoutes()
  }, [])

  // 这里进行用户登录信息检查
  useGetUserSettings()

  // TODO: 国际化相关内容
  useEffect(() => {
    if (locale && language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale])

  const routeLogin = useMatch("/login")

  if (!notShowLoginBtn && !routeLogin) {
    return <LoadingFallback />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Layout>
        <Routes>
          <Route path="/" element={<Workspace />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/thread" element={<ConvLibrary />} />
          <Route path="/skill" element={<Skill />} />
          <Route path="/skill-detail" element={<SkillDetailPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Suspense>
  )
}
