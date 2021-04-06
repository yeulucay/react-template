import React, { useState, useEffect } from "react";
import { Row, Button } from "antd";
import styled from "styled-components";


interface MultiselectRowProps {
	/**
	 * Multiselect islemlerde, kayit sayisinin goruntulendigi text.
	 * Girilecek text'in icersine {size} eklenerek, toplam secili unit sayisi, text icerisinde konumlandirilabilir
	 */
	text: string
	selectedKeys: string[]
	onClose: Function,
	actions?: MultiselectAction[]
	closeText?: string
}

export interface MultiselectAction {
	text: string,
	onClick: Function
}

const RowSection = styled(Row)`
  padding: 8px 0px;
  color: #1890ff;
  min-height: 51px;
`;

const ItemCountTag = styled.div`
  padding: 1px 4px;
  font-size: 12px;
  height: 20px;
  background-color: #F0F5FF;
  border: 1px solid #ADC6FF;
  color: #2F54EB;
  border-radius: 4px;
  margin-top: 6px;
`

const MultiselectRow: React.FC<MultiselectRowProps> = (props: MultiselectRowProps) => {

	return (
		<>
			{
				props.selectedKeys.length > 0 ? (
					<RowSection style={{ justifyContent: 'space-between' }}>
						<ItemCountTag>{props.text.replace("{size}", props.selectedKeys.length.toString())}</ItemCountTag>
						<div >
							{props.actions ? props.actions.map((a, i) => {
								return (<Button key={i} type="link" onClick={() => {
									a.onClick(props.selectedKeys)
									//TODO: sonra kapansin mi?
								}}>{a.text}</Button>)
							}) : ""}
							<Button type="link" onClick={() => { props.onClose() }}>{props.closeText || "Cancel"}</Button>
						</div>
					</RowSection>) : (
					<Row style={{ height: 51 }}>

					</Row>
				)
			}
		</>
	)
}

export default MultiselectRow