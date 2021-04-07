import { getSchema } from "./api/api";

const schemaVersion = 1;

export async function syncSchema(filterNames, baseUrl) {
	const schema = localStorage.getItem("schema");
	const sv = localStorage.getItem("schema_version");

	if (schema && sv && parseInt(sv) === schemaVersion) {
		return filterObjects(filterNames, JSON.parse(schema));
	}

	return await getSchema(baseUrl)
		.then((res) => {
			localStorage.setItem("schema", JSON.stringify(res.data));
			localStorage.setItem("schema_version", schemaVersion);
			return filterObjects(filterNames, res.data);
		})
		.catch((err) => {
			// LOG
		});
}

function filterObjects(filterNames, schema) {
	if (filterNames) {
		const resp = {};
		filterNames
			.filter((f) => schema[f] && schema[f].type !== "multiselect_remote")
			.forEach((f) => {
				const ff = schema[f];
				ff.code = f;
				resp[f] = ff;
			});
		return resp;
	}

	return {};
}

const ops = {
	"eq": { text: "Equals", code: "eq", sign: "=" },
	"ne": { text: "Not equals", code: "ne", sign: "n/=" },
	"in": { text: "In", code: "in", sign: ":" },
	"ni": { text: "Not In", code: "ni", sign: "n/:" },
	"ct": { text: "Contains", code: "ct", sign: "ct" },
	"sw": { text: "Starts with", code: "sw", sign: "starts/w" },
	"ew": { text: "Ends with", code: "ew", sign: "ends/w" },
	"gt": { text: "Greater than (>)", code: "gt", sign: ">" },
	"lt": { text: "Less than (<)", code: "lt", sign: "<" },
	"ge": { text: "Greater or equal", code: "ge", sign: ">=" },
	"le": { text: "Less or equal", code: "le", sign: "<=" }
}

export function getOpsObjects(objs) {
	if (objs) {
		const resp = {};
		objs.forEach(o => {
			if (ops[o]) {
				resp[o] = ops[o];
			}
		});
		return resp;
		// const opsObjects = objs.map((o) => {
		// 	return getOpsObject(o);
		// });
		// return opsObjects;
	}
}

export function getOpsObject(o) {
	switch (o) {
		default:
			return { text: "Unknown", code: o, sign: ":" };
		case "eq":
			return { text: "Equals", code: o, sign: "=" };
		case "ne":
			return { text: "Not equals", code: o, sign: "n/=" };
		case "in":
			return { text: "In", code: o, sign: ":" };
		case "ni":
			return { text: "Not In", code: o, sign: "n/:" };
		case "ct":
			return { text: "Contains", code: o, sign: "ct" };
		case "sw":
			return { text: "Starts with", code: o, sign: "starts/w" };
		case "ew":
			return { text: "Ends with", code: o, sign: "ends/w" };
		case "gt":
			return { text: "Greater than (>)", code: o, sign: ">" };
		case "lt":
			return { text: "Less than (<)", code: o, sign: "<" };
		case "ge":
			return { text: "Greater or equal", code: o, sign: ">=" };
		case "le":
			return { text: "Less or equal", code: o, sign: "<=" };
	}
}

export function getFilterPayload(data) {
	if (data) {
		return data.map((d) => {
			var value = undefined;

			if (
				d.selectedOperator.code === "in" ||
				d.selectedOperator.code === "ni"
			) {
				value = d.value.map((m) => m.code);
			} else {
				if (d.selectedItem.type === "money") {
					value = getNumericPart(d.value[0].text);
				} else {
					value = d.value[0].text;
				}
			}
			return {
				key: d.selectedItem.code,
				op: d.selectedOperator.code,
				value: value,
			};
		});
	}
	return [];
}

export function getAdsTextFields() {
	const schema = localStorage.getItem("schema");
	const resp = [];

	if (schema) {
		for (const [key, value] of Object.entries(JSON.parse(schema))) {
			if (value.section?.key === "ad" && value.type === "text_input") {

				resp.push({ text: value.name, id: key });
			}
		}
	}

	return resp;
}

export function getNumericPart(money, decimal = ",") {
	var pattern = /\d+/g;
	const strNum = money.match(pattern).join("");

	var dl = 0; // decimal length
	var id = money.indexOf(decimal);
	if (id > -1) {
		dl = money.length - id - 1;
	}

	return parseInt(strNum) / Math.pow(10, dl);
}

const directions = {
	"ascend": "ASC",
	"descend": "DESC"
}

export function getDirectionAbbr(direction) {
	if (direction) {
		return directions[direction]
	}
}
