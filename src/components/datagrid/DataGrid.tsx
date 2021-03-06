import React, { useEffect, useState } from "react";
import { DownloadOutlined, CloseOutlined, SlidersFilled } from "@ant-design/icons";
import { Input, Table, Space, Row, Button, Col, Tag, message, Popover } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import styled from "styled-components";
import FilterSection from "./FilterSection";
import ColumnList from "./ColumnList/ColumnList";
import MenuIcon from "./menu.svg";
import ActionList, { CustomAction } from "./ActionList";
import { MultiselectAction } from "./MultiselectRow";
import MultiselectRow from "./MultiselectRow";
import { api } from "./api/api";
import { getDirectionAbbr } from "./schema";
import "./datagrid.css";
import { FormProvider } from "antd/lib/form/context";

interface HttpPayload {
  page: number
  page_size: number
  filters: any[]
  search: string
  sort: any
}

interface Pagination {
  total: number
  current: number
  pageSize: number
}

interface DataGridProps {
  columns: Array<any>
  /**
   * DataGrid icerisine data listesi elle verilmek istendiginde, 'data' property'si kullanilir.
   */
  data?: any[]
  /**
   * Data satirlari icin key olacak property ismi.
   */
  rowKey: string
  /**
   * Listeleme veya silme islemleri icin sunucu tarafinin baseUrl'idir.
   */
  baseUrl: string
  /**
   * Listelenecek veriler, componente api call response olarak alinacak olursa eger, 
   * listUrl property'sine verilecek url'ye gonderilecek istegin response degeri, 
   * data grid icerisinde goruntulenecektir. 
   * Not: columns property'sinin dogru set edilmesi gerekmektedir. 
   */
  listUrl?: string
  /**
   * Satir sonlarinda bulunan action'larda, delete isleminin gorunmesini saglar. 
   * Delete action butonuna basildignda, set edilen url'ye http DELETE istegi atar. 
   * url'nin sonuna id, ilgili satirin key degeri olacak sekilde eklenir. 
   * Ornek olarak, deleteUrl: '/remove' olarak set edilirse istek; BASE_URL/remove/{key} 'e gonderilir.
   */
  deleteUrl?: string
  /**
   * onEdit, satir sonlarinda bulunan action'larda, edit isleminin gorunmesini saglar.
   * Edit butonuna basildiginda tetiklenir.
   */
  onEdit?: Function
  /**
   * onDelete, satir sonlarinda bulunan action'larda, delete isleminin gorunmesini saglar. 
   * Delete action butonuna basildiginda tetiklenir. 
   * Not: Eger deleteUrl set edildiyse, delete istegi sunucu tarafina gonderildiginde, 
   * basarili response alirsa, onDelete cagirilir. (basarili islem).
   * Eger deleteUrl set edilmediyse, direkt olarak cagirilir. 
   */
  onDelete?: Function
  /**
   * customActions satir sonlarinda bulunan action listesine eklenecek olan islemlerdir.
   */
  customActions?: CustomAction[]
  /**
   * Listelenecek veri disaridan 'data' property'si ile saglandiginda,
   * loading de disaridan kontrol edilmek istenebilir. Bu durumda isLoading kullanilacaktir. 
   */
  isLoading?: boolean
  /**
  * Multiselect islemlerde, kayit sayisinin goruntulendigi text.
  * Girilecek text'in icersine {size} eklenerek, toplam secili unit sayisi, text icerisinde konumlandirilabilir
  * Ornek: "{size} item selected" 
  */
  multiselectText?: string
  /**
   * Multiselect ozelligini kapatmak icin satir sonundaki cancel butonu text'i 
   */
  multiselectCloseText?: string
  /**
   * Multiselect islemlerde acilan panelde goruntulenecek butonlar listesidir.
   */
  multiselectActions?: MultiselectAction[]
  /**
   * Search box icerisinde yazacak olan placeholder
   */
  searchPlaceholder?: string
  /**
   * Create button uzerinde yazacak olan text
   */
  createButtonText?: string
  /**
   * Create buttonuna tiklandiginda tetiklenecek olan event handler. 
   * ONEMLI: Create butonunun gorunebilir olmasi icin, bu handler set edilmelidir.
   */
  onCreate?: Function,
  /**
   * Filters yerine gececek text parametresi
   */
  filtersText?: string
  /**
   * Columns yerine gececek text parametresi
   */
  columnsText?: string
  /**
   * Actions sutunu header'i yerine gececek text parametresi
   */
  actionText?: string
  /**
   * Sort edilmeyecek sutunlar listesi.
   */
  excludedSorters?: string[]
}

const SearchSection = styled(Row)`
  margin-bottom: 1%;
`;
const RowSection = styled(Row)`
  background: white;
  padding-top: 10px;
  padding-bottom: 13px;
  height: 51px;
`;
const RightSection = styled(Col)`
  display: flex;
  justify-content: flex-end;
`;
const ButtonStyle = styled(Button as any)`
`;
const FilterTag = styled.div`
  padding: 2px 4px;
  background-color: #FAFAFA;
  border: 1px solid #BBBBBB;
  margin-left: 8px;
  border-radius: 4px;
`

const PAGE_SIZE = 10;

const DataGrid: React.FC<DataGridProps> = (props: DataGridProps) => {
  const [loading, setLoading] = useState(false);
  const [showMultiselect, setShowMultiselect] = useState(false);
  const [data, setData] = useState([] as any[]);
  const [payload, setPayload] = useState<HttpPayload>({
    page: 1,
    page_size: PAGE_SIZE,
    filters: [],
    sort: {},
    search: ""
  } as HttpPayload)
  const [pagination, setPagination] = useState<Pagination>({ current: 1, pageSize: PAGE_SIZE, total: 0 });
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState([] as any[]);
  const [colList, setColList] = useState([] as any[]);
  const [searchText, setSearchText] = useState("");
  const [filterNames, setFilterNames] = useState([]);
  const { Search } = Input;

  useEffect(() => {
    if (props.data) {
      // data with keys
      const dwk = props.data.map((r: any, i: number) => {
        return {
          ...r,
          key: r[props.rowKey] || i
        }
      })
      setData(dwk);
    } else if (props.listUrl) {
      getDataList(payload);
    }
  }, [props.listUrl, props.data]);

  useEffect(() => {
    var cls = [...props.columns];
    cls = cls.map((c) => {
      return ({ ...c, sorter: c.unsortable ? false : true })
    })
    if (props.onDelete || props.onEdit || (props.customActions && props.customActions.length > 0)) {
      cls.push(
        {
          title: props.actionText || "Actions",
          width: 70,
          fixed: 'right',
          render: (value: any, record: any) => (
            <Popover className={"datagrid-action-popover"} trigger="click" placement="left" content={getActionMenu(record["key"])} >
              <img src={MenuIcon} style={{ height: 16, cursor: 'pointer', float: 'right' }} />
            </Popover>
          ),
        },
      )
    }
    setColList(cls);
  }, [props.columns])

  useEffect(() => {
    if (props.isLoading !== undefined) {
      setLoading(props.isLoading)
    }
  }, [props.isLoading]);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setShowMultiselect(true);
    } else {
      setShowMultiselect(false);
    }
  }, [selectedRows]);

  const getDataList = (payload: HttpPayload) => {
    setLoading(true);
    api(props.baseUrl).post(props.listUrl!, payload).then((response: any) => {
      if (response.data.records) {
        // records with keys
        const rwk = response.data.records.map((r: any, i: number) => {
          return {
            ...r,
            key: r[props.rowKey] || i
          }
        })
        pagination.total = response.data.total_records;
        setLoading(false)
        setData(rwk);
      }
      if (response.data.filters) {
        setFilterNames(response.data.filters);
      }
    }).catch(err => {
      //TODO
      setLoading(false)
    })
  }

  const rowDeleted = (rowId: string) => {
    if (props.deleteUrl) {
      api(props.baseUrl).delete(`${props.deleteUrl}/${rowId}`).then((response: any) => {
        if (props.onDelete) {
          props.onDelete(rowId); // sunucu istegi sonrasi, islem basarili tamamlaninca cagirilir
        }
      }).catch(err => {
        //TODO
      })
    } else if (props.onDelete) {
      // eger sunucu istegi yoksa, o zaman direkt olarak cagirilir
      props.onDelete(rowId);
    }
  }

  const rowEdited = (rowId: string) => {
    if (props.onEdit) {
      props.onEdit(rowId);
    }
  }

  const getActionMenu = (id: string) => {
    return (
      <ActionList
        rowId={id}
        customActions={props.customActions}
        onDelete={props.deleteUrl || props.onDelete ? rowDeleted : undefined}
        onEdit={props.onEdit ? rowEdited : undefined} />
    )
  }

  const getFilterName = (filter: any) => {
    var value = "";
    if (Array.isArray(filter.value)) {
      const v = filter.value as Array<string>
      value = v.join(",")
    } else {
      value = "\"" + filter.value + "\"";
    }

    return (<span>{filter.name} <b>{filter.ops.sign}</b> {value}</span>)
  };

  const onRowSelect = (selectedRowKeys: any) => {
    setSelectedRows(selectedRowKeys);
  };
  var rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: onRowSelect,
  };

  const removeFilter = (filter: any) => {
    const currentFilters = [...filters];
    const idx = currentFilters.indexOf(filter);
    if (idx > -1) {
      currentFilters.splice(idx, 1);
      setFilters(currentFilters);
      const filterParams = currentFilters.map((f) => {
        return { key: f.code, op: f.ops.code, value: f.value }
      })
      const currentPayload = { ...payload, filters: filterParams }
      setPayload(currentPayload);
      getDataList(currentPayload);
    }
  };

  const multiselectClosed = () => {
    setSelectedRows([]);
  }

  const pageChanged = (pagination: any, _: any, sort: any) => {
    console.log('SS: ', sort);
    setPagination(pagination)
    const newPayload = { ...payload, page: pagination.current, page_size: pagination.pageSize }
    if (sort.order) {
      const objField = sort.field;
      var sortObj: any = {};
      const direction = getDirectionAbbr(sort.order);
      sortObj[objField] = direction;
      newPayload.sort = sortObj;
    } else {
      newPayload.sort = {};
    }
    setPayload(newPayload);
    getDataList(newPayload);
  }

  const searched = (src: string) => {
    setSearchText(src);
    const newPayload = { ...payload, search: src }
    setPayload(newPayload);
    getDataList(newPayload);
  }

  const dataFiltered = (filter: any) => {
    const currentFilters = [...filters];
    if (filter) {
      const existingFilter = filters.find((f) =>
        f.code === filter.code &&
        f.ops.code === filter.ops.code
      );

      if (existingFilter) {
        message.warning("Filter has already been added!")
      } else {
        currentFilters.push(filter);
        setFilters(currentFilters);
        const filterParams = currentFilters.map((f) => {
          return { key: f.code, op: f.ops.code, value: f.value }
        })
        const currentPayload = { ...payload, filters: filterParams }
        setPayload(currentPayload);
        getDataList(currentPayload);
      }
    }
  }

  return (
    <div>
      <SearchSection>
        <Col lg={4}>
          {props.onCreate ? (
            <Button
              type={"primary"}
              onClick={() => {
                props.onCreate!()
              }}
            >{props.createButtonText || "Add New"}</Button>
          ) : ""}
        </Col>
        <RightSection lg={20}>
          <div style={{ float: "left" }}>
            <FilterSection
              baseUrl={props.baseUrl}
              filterNames={filterNames}
              onFilter={dataFiltered} />
          </div>
          <div style={{ float: "left", marginLeft: 7 }}>
            <ColumnList text={props.columnsText} columns={colList} onColOrderChange={
              (reorderedCols: any[]) => { setColList(reorderedCols) }
            } />
          </div>
          <div style={{ float: "left", marginLeft: 7 }}>
            <ButtonStyle
              icon={<DownloadOutlined />}
              onClick={() => { }}>Download</ButtonStyle>
          </div>
          <Search
            placeholder={props.searchPlaceholder || "Search"}
            onSearch={searched}
            style={{ width: 320, marginLeft: 7 }}
          />
        </RightSection>
      </SearchSection>
      {selectedRows.length > 0 ? (
        <MultiselectRow
          text={props.multiselectText || "{size} item(s) selected."}
          selectedKeys={selectedRows}
          onClose={multiselectClosed}
          actions={props.multiselectActions}
          closeText={props.multiselectCloseText}
        />
      ) : (
        <RowSection>
          <FilterOutlined style={{ marginTop: 'auto', marginBottom: 'auto' }} />
          <span style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 8 }}>{props.filtersText || "Filters"}:</span>
          {filters.map((filter, idx) => (
            <FilterTag key={idx} onClick={() => { /*TODO: Edit existing filter*/ }}>
              {getFilterName(filter)}
              <CloseOutlined style={{ marginLeft: 10, fontSize: 10, marginBottom: 2 }} onClick={() => removeFilter(filter)} />
            </FilterTag>
          ))}
        </RowSection>
      )}
      <Table
        columns={colList}
        dataSource={data}
        loading={loading}
        rowSelection={rowSelection}
        pagination={pagination}
        onChange={pageChanged}
      ></Table>
    </div >
  );
}

export default DataGrid
