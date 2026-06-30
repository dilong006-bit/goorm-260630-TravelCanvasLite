import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import WriteStory from './pages/WriteStory.jsx'
import Story from './pages/Story.jsx'
import Timeline from './pages/Timeline.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/write" element={<WriteStory />} />
        <Route path="/story/:id" element={<Story />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
