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

    const comicRes = await fetchData("1cc57efa8a9b80bb9bfef0d26cbc4253");
    const comics = [];

    comicRes.results.forEach(item => {
        const title = item.properties["name"].title[0].text.content;
        const cover = item.properties["cover"].files[0].file.url;
        let folder_name = "不分類";
        if(item.properties["folder_name"].rich_text.length > 0) {
            folder_name = item.properties["folder_name"].rich_text[0].text.content;
        }
        const tagsList = item.properties["tags"].relation.map(r => tagIds[r.id]);
        const id = item.id.replace(/-/g, "");    
        comics.push({
            title: title,
            cover: cover,
            folder_name: folder_name,
            tags: tagsList,
            id: id,
        }); 
    
    });

    // console.log("comics:", comics);
    return Response.json({ 
        tags: tags,
        comics: comics,
    })
}