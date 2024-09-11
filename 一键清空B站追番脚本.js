// ==UserScript==
// @name         一键清空B站追番脚本
// @namespace    http://tampermonkey.net/
// @version      2024-09-11
// @description  在页面上生成一个清空按钮，点击后当前页面所有 追番/追剧 都会被取消
// @author       Rowan
// @match        *://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const isValidPage = (path) => {
        return path.endsWith('/bangumi') || path.endsWith('/cinema');
    }


    const clearCurrentPageAllDramaSeries = () => {
        const allDramaSeriesOptionsList = document.querySelectorAll('.opt-list');

        if(!allDramaSeriesOptionsList.length) {
            return;
        }

        for (let i = 0; i < allDramaSeriesOptionsList.length; i++) {
            if(allDramaSeriesOptionsList[i]?.children.length === 4) {
                const cancelButton = allDramaSeriesOptionsList[i]?.children[3];
                cancelButton?.click();
            }
        }

        location.reload();
    }

    const addStyleToDom = (dom) => {
        if(!dom) {
            return;
        }

        const baseTextColor = '#222';

        dom.style.fontSize = '12px';
        dom.style.fontFamily = 'PingFang SC, Helvetica Neue, Microsoft YaHei, sans-serif';
        dom.style.color = baseTextColor;
        dom.style.cursor = 'pointer';

        dom.addEventListener('mouseover', () => {
            dom.style.color = '#ea7a99';
        });

        dom.addEventListener('mouseout', () => {
            dom.style.color = baseTextColor;
        });
    }

    const renderDomToPage = () => {
        const buttonDom = document.createElement('p');
        buttonDom.innerText = '清空当前页所有追番/追剧';

        addStyleToDom(buttonDom);

        buttonDom.addEventListener('click', clearCurrentPageAllDramaSeries);

        const currentInsetDom = document.querySelector('.filter-content');
        if(currentInsetDom) {
            currentInsetDom.appendChild(buttonDom)
        }
    }

    const monitorUrlChange = () => {
        let previousUrl = window.location.href;
        setInterval(() => {
            const currentUrl = window.location.href;
            if(previousUrl !== currentUrl) {
                previousUrl = currentUrl;
                if(isValidPage(currentUrl)) {
                    renderDomToPage()
                }
            }
        }, 60)
    }

    monitorUrlChange();

    setTimeout(() => {
        if(isValidPage(window.location.href)) {
            renderDomToPage()
        }
    }, 1000 * 1)
})();
