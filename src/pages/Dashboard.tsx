import React from "react";
import { Layout, Menu, Tag, Space, message } from "antd";
import styled from "styled-components";
import {
  ProfileOutlined,
  CloudServerOutlined,
  CreditCardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import DataGrid from "../components/datagrid/DataGrid";
import { InvoiceStatus } from "../enum/InvoiceStatus";

const { Header, Content, Sider } = Layout;

const StyledTag = styled(Tag as any)``;

const StyledHeader = styled(Header)`
  padding-left: 40px;
  background: #fff;
`;

const StyledContent = styled(Content)`
  background-color: #fff;
  margin: 20px;
`;

const StyledMenu = styled(Menu as any)``;

const Dashboard: React.FC = () => {

  const getInvoiceColor = (value: string) => {
    switch (value) {
      case "PAUSED":
        return "gold";
      case "ENABLED":
        return "green";
      default:
      case "REMOVED":
      case "ENDED":
        return "red";
    }
  };

  var columns = [
    {
      title: "Campaign",
      dataIndex: "campaign_name",
    },
    {
      title: "Impression",
      dataIndex: "count_impression",
    },
    {
      title: "Status",
      dataIndex: "status_description",
      render: (value: any, record: any) => {
        return (
          <StyledTag color={getInvoiceColor(record.campaign_user_status)} key={record.campaign_user_status}>
            {record.status_description}
          </StyledTag>
        );
      },
    },

  ];

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0" theme="light">
        <StyledMenu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <StyledMenu.Item key="1" icon={<ProfileOutlined />}>
            Faturalar
          </StyledMenu.Item>
          <StyledMenu.Item key="2" icon={<CreditCardOutlined />}>
            Ödeme Yöntemleri
          </StyledMenu.Item>
          <StyledMenu.Item key="3" icon={<CloudServerOutlined />}>
            Hizmetler
          </StyledMenu.Item>
          <StyledMenu.Item key="4" icon={<SettingOutlined />}>
            Ayarlar
          </StyledMenu.Item>
        </StyledMenu>
      </Sider>
      <Layout>
        <StyledHeader className="site-layout-sub-header-background">
          <h2>Faturalar</h2>
        </StyledHeader>
        <StyledContent>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 1024 }}
          >
            <DataGrid
              rowKey={"campaign"}
              columns={columns}
              // data={[
              //   {
              //     id: 1,
              //     campaign_name: "My Campaign",
              //     count_impression: 100,
              //     campaign_user_status: "PAUSED",
              //     status_description: "Paused"
              //   }
              // ]}
              // onDelete={(id: string) => { alert("DELETE: " + id) }}
              // onEdit={(id: string) => { alert("EDIT: " + id) }}
              // customActions={[
              //   {
              //     text: "Test",
              //     onClick: (id: string) => { alert("TEST: " + id) }
              //   }
              // ]}
              // multiselectActions={[
              //   {
              //     text: "Custom Action 1",
              //     onClick: (ids: string[]) => { console.log("CUSTOM 1: ", ids) }
              //   }
              // ]}
              // multiselectCloseText={"Iptal"}
              onCreate={() => { }}
              baseUrl={"https://dashboard.gowit-test.com/api"}
              listUrl={"/accounts/1/tables/campaigns"}
            />
          </div>
        </StyledContent>
      </Layout>
    </Layout>
  );
}

export default Dashboard
