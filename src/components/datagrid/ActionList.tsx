import React from "react";
import { List } from "antd";
import "./action-list.css"

export interface CustomAction {
	text: string
	onClick: Function
}

interface ActionListProps {
	rowId: string,
	onEdit?: Function,
	onDelete?: Function,
	customActions?: CustomAction[]
}

const ActionList: React.FC<ActionListProps> = (props: ActionListProps) => {

	return (
		<List style={{ cursor: 'pointer' }}>
			{
				props.customActions?.map((ca, i) => {
					return (<List.Item key={i} className="datagrid-action-list-item"
						onClick={() => { ca.onClick(props.rowId) }}>{ca.text}</List.Item>)
				})
			}
			{props.onEdit ? (
				<List.Item className={"datagrid-action-list-item"}
					onClick={() => { props.onEdit!(props.rowId) }}>Güncelle</List.Item>
			) : ""}

			{props.onDelete ? (
				<List.Item className={"datagrid-action-list-item"}
					onClick={() => {
						console.log("BEFORE DELETE: ", props.rowId)
						props.onDelete!(props.rowId)
					}}>Sil</List.Item>
			) : ""}

		</List>
	)
}

export default ActionList;