const tabs = await chrome.tabs.query({});
const template = document.getElementById("tab-list");
const elements = new Set();
const tabState = {};

for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);
    const title = tab.title;
    const url = tab.url;
    const titleInput = element.querySelector(".title-input");
    const urlText = element.querySelector(".url")
    const tabIcon = element.querySelector(".material-icons")

    tabIcon.textContent = tab.active ? "tab" : "tab_unselected"

    tabIcon.addEventListener("click", async () => {
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    });

    titleInput.value = title;
    tabState[tab.id] = title;
    urlText.textContent = url;

    if (url.startsWith("chrome://")) {
        titleInput.disabled = true;
    }

    titleInput.addEventListener("input", async (e) => {
        const newTitle = e.target.value;
        tabState[tab.id] = newTitle;

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (title) => {
                document.title = title;
            },
            args: [newTitle],
        });
    });

    urlText.addEventListener("click", async () => {
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    });



    elements.add(element);
}

document.querySelector("ul").append(...elements);
