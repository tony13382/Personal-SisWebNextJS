const token = "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";
const headers = {
    "Authorization": `Bearer ${token}`,
    "Notion-Version": "2021-05-13",
    "Content-Type": "application/json"
};

async function fetchData(databaseId) {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({})
    });
    return await response.json();
}

export async function GET(request) {

    const tagRes = await fetchData("1cb57efa8a9b80bf8b19e630f0875c38");
    const tags = [];
    const tagIds = {};
    tagRes.results.forEach(item => {
        const name = item.properties["name"].title[0].text.content;
        tags.push(name);
        tagIds[item.id] = name;
    });
    // console.log("Tags:", tags);

    const imgRes = await fetchData("1cb57efa8a9b80588ba1dde3e7e5322a");
    const imgs = [];

    imgRes.results.forEach(item => {
        const name = item.properties["name"].title[0].text.content;
        const tagsList = item.properties["tags"].relation.map(r => tagIds[r.id]);
        item.properties["media"].files.forEach(file => {
            imgs.push({
                name: name,
                tags: tagsList,
                url: file.file.url,
            }); 
        });
    });

    // console.log("imgs:", imgs);
    return Response.json({ 
        tags: tags,
        imgs: imgs,
    })
}