import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { List, Popover, Button } from "antd";
import ReactDragListView from "react-drag-listview";
import { OrderedListOutlined } from "@ant-design/icons";
import styled from "styled-components";
import DragIcon from "../../../assets/unfold.svg";

const ddd = [
	"row 1.",
	"Japanese princess to wed commoner.",
	"Australian walks 100km after outback crash.",
	"Man charged over missing wedding girl.",
	"Los Angeles battles huge wildfires."
];

const ColumnList = props => {
	const { columns, onColOrderChange } = props;

	const [data, setData] = useState();
	const [cols, setCols] = useState([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setData(ddd);
	}, []);

	useEffect(() => {
		setCols(columns);
	}, [columns]);

	const Btn = styled(Button)``;

	const onDragEnd = (fromIndex, toIndex) => {
		if (toIndex < 0) return; // Ignores if outside designated area

		const items = [...cols];
		const item = items.splice(fromIndex, 1)[0];
		items.splice(toIndex, 0, item);
		setCols(items);
		if (onColOrderChange) {
			onColOrderChange(items);
		}
	};

	const content = (
		<div>
			<ReactDragListView
				nodeSelector=".ant-list-item.draggble"
				onDragEnd={onDragEnd}
			>
				<List
					size="small"
					bordered
					dataSource={cols}
					renderItem={item => {
						const draggble = !!item.dataIndex;
						return (
							<List.Item
								style={{ cursor: "move" }}
								actions={draggble ? [(<img style={{ height: 12, width: 12 }} src={DragIcon} />)] : ""}
								className={draggble ? "draggble" : ""}
							>
								<span style={draggble ? {} : { color: '#AAAAAA' }}>{item.title}</span>
							</List.Item>
						);
					}}
				/>
			</ReactDragListView>
		</div>
	);

	return (
		<Popover
			placement="bottomRight"
			title={"Sütunlar"}
			content={content}
			trigger="click"
			visible={open}
			onVisibleChange={(value) => setOpen(value)}
		>
			<Btn icon={<OrderedListOutlined />} />
		</Popover>
	);

}

export default ColumnList
