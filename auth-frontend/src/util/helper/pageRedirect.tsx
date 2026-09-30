import { menuItems, pageNames } from "../../enum/Navigation";

export const hasPageAccess = (permission: any[], action: "view") => {
    console.log(permission, "permission");

    if (!permission || permission.length === 0) return "/login";

    const viewableModule = permission.filter((item) => {
        try {
            const access = JSON.parse(item.accessTypes)
            return access?.[action] === true;
        } catch (error) {
            console.error("Error parsing permissions", error);
        }
    }).map((p) => p.module?.moduleId)

    const dataObj = menuItems.reduce((acc, data) => {
        if (data.children && data.children.length > 0) {
            data.children.forEach((child) => {
                if (child.path && child.pageName) {
                    console.log(child.pageName, "child.pageName");

                    acc[child.pageName] = child.path;
                }
            })
        }
        else if (data.path && data.pageName) {
            acc[data.pageName] = data.path;
        }
        return acc;
    }, {})

    console.log("viewableModule", viewableModule);
    console.log("dataObj", dataObj);
    if (viewableModule.includes(dataObj[pageNames.dashboard]) && dataObj[pageNames.dashboard]) {
        return dataObj[pageNames.dashboard];
    }

    if (viewableModule.includes(dataObj[pageNames.users]) && dataObj[pageNames.users]) {
        return dataObj[pageNames.users];
    }

    for (const moduleId of viewableModule) {
        if (dataObj[moduleId]) {
            return dataObj[moduleId];
        }
    }


    return "/login";
}