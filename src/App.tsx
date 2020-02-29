import React from "react";
import { Col, Layout, Row, Typography } from "antd";
import { AnimationClip } from "three";
import { ThreeCanvas } from "./three/ThreeCanvas";
import { Tracks } from "./ui/Tracks";

let { Title } = Typography;
let { Sider, Header, Content } = Layout;

function App() {
  let [clips, setClips] = React.useState<AnimationClip[]>([]);
  return (
    <Layout style={{ height: "100%" }}>
      <Header>
        <Row align={"middle"} style={{ height: "100%" }}>
          <Col span={24}>
            <Title level={4} style={{ textAlign: "center" }}>
              ANIMATION TOOL
            </Title>
          </Col>
        </Row>
      </Header>
      <Layout style={{ height: "100%" }}>
        <Sider width={350}>
          <Tracks setClips={setClips} />
        </Sider>
        <Content style={{ height: "100%" }}>
          <ThreeCanvas clips={clips} />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
