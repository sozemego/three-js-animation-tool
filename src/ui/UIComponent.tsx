import React from "react";
import { Layout } from "antd";
import { Tracks } from "./Tracks";
import { ThreeCanvas } from "../three/ThreeCanvas";

let { Sider, Header, Content } = Layout;

export function UIComponent() {
  return (
    <Layout className={"layout"}>
      <Sider>
        <Tracks />
      </Sider>
      <Layout>
        <Header>Anim tool</Header>
        <Content>{/*<ThreeCanvas />*/}</Content>
      </Layout>
    </Layout>
  );
}
