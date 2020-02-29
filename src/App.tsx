import React from "react";
import { ThreeCanvas } from "./three/ThreeCanvas";
import { Tracks } from "./ui/Tracks";
import { Col, Layout, Row } from "antd";
import { Typography } from "antd";
let { Title } = Typography;
let { Sider, Header, Content } = Layout;

function App() {
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
          <Tracks />
        </Sider>
        <Content style={{ height: "100%" }}>
          <ThreeCanvas />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
