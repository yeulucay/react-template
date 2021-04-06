import React, { useState, useEffect } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { Space, Button, Popover, Select, InputNumber, DatePicker, Input } from "antd";
import styled from "styled-components";
import MoneyInput from "antd-money";
import { syncSchema, getOpsObjects } from "./schema";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 580px;
`;
const FilterValueSection = styled.div`
  // margin-right: 5%;
`;
const FilterButtonSection = styled.div`
  margin-top: 5%;
  display: flex;
  justify-content: flex-end;
`;

const ButtonStyle = styled(Button as any)`
  margin-left: 5%;
`;

const Btn = styled(Button as any)``;

const { Option } = Select as any;

export interface FilterSectionsProps {
  onFilter: Function
  filterNames: string[]
  baseUrl: string
}

interface FilterListItem {
  name: string
  code: string
  ops: string[]
  type: string
  values: any[]
}

interface OpsItem {
  text: string
  code: string
}

export default function FilterSection(props: FilterSectionsProps) {
  const [open, setOpen] = useState(false);
  const [filterList, setFilterList] = useState<any>({});
  const [opsList, setOpsList] = useState<any>({});
  const [selectedFilter, setSelectedFilter] = useState<FilterListItem>({} as FilterListItem);
  const [selectedOps, setSelectedOps] = useState<OpsItem>({} as OpsItem);
  const [selectedValueKey, setSelectedValueKey] = useState<any>(undefined);

  useEffect(() => {
    if (props.filterNames) {
      syncSchema(props.filterNames, props.baseUrl).then(filters => {
        console.log('FILTERS: ', filters);
        setFilterList(filters);
      })
    }
  }, [props.filterNames]);

  const getFilterOptions = () => {
    return Object.keys(filterList).map((key: string) => {
      const filterObj = filterList[key];
      return (<Option key={filterObj.code}>{filterObj.name}</Option>)
    })
  }

  const printValueSection = () => {
    switch (selectedFilter?.type) {
      case "text_input":
        return (
          <Input placeholder={"Type"} onChange={(e) => { setSelectedValueKey(e.target.value) }} />
        )
      case "multiselect":
        return (
          <Select
            mode="multiple"
            style={{ width: 160 }}
            value={selectedValueKey}
            placeholder={"Select"}
            onChange={(value) => { setSelectedValueKey(value) }}
          >
            {Object.keys(selectedFilter.values).map((v) => {
              return (
                <Option key={v}>{v}</Option>
              )
            })}
          </Select>
        );
      case "money":
        return (
          <MoneyInput prefix={"$"} commaSeperator={true} onChange={(value: any) => setSelectedValueKey(value)} />
        );
      case "datepicker":
        return (
          <DatePicker
            style={{ width: 160 }}
            onChange={(value: any) => { }}
            onOk={(value: any) => { setSelectedValueKey(value) }}
          />
        );
      case "percentage":
        return (
          <InputNumber
            style={{ width: 160 }}
            formatter={(value) => `${value}`}
            parser={(value?: string) => value!.replace('%', '')}
            onChange={(e: any) => {
              console.log('PER VALUE: ', e);
              //setSelectedValueKey(e.target.value) 
            }}
          />
        )
    }
    return (
      <Input disabled={true} onFocus={(e) => { }} />
    )
  };

  const getOpsOptions = () => {
    return Object.keys(opsList).map((key: string) => {
      const opsObj = opsList[key];
      return (<Option key={opsObj.code}>{opsObj.text}</Option>)
    })
  }

  const handleChange = (value: string) => {
    const sv = filterList[value]; // selected value
    setSelectedOps({} as OpsItem);
    setSelectedValueKey(undefined)
    setSelectedFilter(sv);
    if (sv.ops) {
      const list = getOpsObjects(sv.ops);
      setOpsList(list);
    }
  };

  const handleOpsChange = (value: string) => {
    const so = opsList[value]; // selected ops
    console.log('SELECTED OPS: ', so);
    setSelectedOps(so);
  }

  const filterAdded = () => {
    const filter = {
      name: selectedFilter.name,
      code: selectedFilter.code,
      ops: selectedOps,
      value: selectedValueKey
    }

    props.onFilter(filter);

    clearAndClose();
  }

  const clearAndClose = () => {
    setSelectedFilter({} as FilterListItem)
    setSelectedValueKey(undefined)
    setSelectedOps({} as OpsItem);
    setOpen(false);
  }

  const content = (
    <>
      <Wrapper>
        <FilterValueSection>
          <p>Columns</p>
          <div>
            <Space>
              <Select
                placeholder={"Select"}
                style={{ width: 220 }}
                onChange={handleChange}
                value={selectedFilter.name}
              >
                {getFilterOptions()}
              </Select>
            </Space>
          </div>
        </FilterValueSection>
        <FilterValueSection>
          <p>Ops</p>
          <div>
            <Space>
              <Select
                value={selectedOps.code}
                placeholder="Select"
                style={{ width: 160 }}
                onChange={handleOpsChange}
              >
                {getOpsOptions()}
              </Select>
            </Space>
          </div>
        </FilterValueSection>
        <FilterValueSection>
          <p style={{ width: 160 }}>Value</p>
          <div>
            <Space style={{ width: 160 }}>{printValueSection()}</Space>
          </div>
        </FilterValueSection>
      </Wrapper>
      <FilterButtonSection>
        <Btn onClick={() => clearAndClose()}>Cancel</Btn>
        <ButtonStyle type="primary" onClick={() => filterAdded()}>
          Add Filter
        </ButtonStyle>
      </FilterButtonSection>
    </>
  );
  return (
    <Popover
      placement="bottomRight"
      title={"Add Filter"}
      content={content}
      trigger="click"
      visible={open}
      onVisibleChange={(value: React.SetStateAction<boolean>) => setOpen(value)}
    >
      <Btn icon={<FilterOutlined />}>Filters</Btn>
    </Popover>
  );
}
