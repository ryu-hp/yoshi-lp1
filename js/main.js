'use strict';
// ------------------------------------------
// details要素のアコーディオンメニューに開閉のアニメーションを付与するスクリプト
// ------------------------------------------

/** 使用条件（HTMLの設定）
  1. アコーディオンメニューを設定したいdetailsを持つ親要素に
    "js-details-accordion-menus"を設定する。
   ------------------------------------------*/

/* ▼ ここからスクリプトの処理 ▼ */
/* メインプロック
  ------------------------------------------*/

class DetailsAccordionMenu {
  static CLASS = {
    TARGET: 'js-details-accordion-menus',
    IS_OPEN: 'is-open'
  };

  constructor(parentElement) {
    this.parentElement = parentElement;
    this.initEventListeners();
  }

  //イベントリスナー初期設定
  initEventListeners() {
    this.parentElement.addEventListener('click', (event) => {
      const summaryElement = event.target.closest('summary');
      if (!summaryElement) return;
      event.preventDefault();
      this.toggleAccordion(summaryElement);
    });
  }

  //summaryをクリックした場合
  toggleAccordion(summaryElement) {
    const detailsElement = summaryElement.closest('details');
    detailsElement.hasAttribute('open') ? this.closeAccordion(detailsElement) : this.openAccordion(detailsElement);
  }

  //閉じる処理
  closeAccordion(detailsElement) {
    const TRANSITION_DEFAULT = 'all 0s ease 0s';
    const FORCE_CLOSE_DURATION = 1000;
    // detailsの子要素の中でsummaryではない要素 = 説明側の要素
    const descElement = [...detailsElement.children].find((element) => !(element.tagName === 'SUMMARY'));
    const transitionStyle = window.getComputedStyle(descElement).transition;
    detailsElement.classList.remove(DetailsAccordionMenu.CLASS.IS_OPEN);

    // 説明側の要素のtransitionが初期値=未設定の場合は即閉じる
    if (transitionStyle === TRANSITION_DEFAULT) {
      detailsElement.removeAttribute('open');
      return;
    }

    // トランジション終了後にopen属性除去
    const handleTransitionEnd = () => {
      clearTimeout(this.timeoutID);
      detailsElement.removeAttribute('open');
    };

    descElement.addEventListener('transitionend', handleTransitionEnd, { once: true });

    // transitionEndが実行されなかった場合のフォールバック処理
    this.timeoutID = setTimeout(() => {
      if (!detailsElement.hasAttribute('open')) return;
      detailsElement.removeAttribute('open');
      descElement.removeEventListener('transitionend', handleTransitionEnd);
    }, FORCE_CLOSE_DURATION);
  }

  //開く処理
  openAccordion(detailsElement) {
    detailsElement.setAttribute('open', true);
    setTimeout(() => {
      detailsElement.classList.add(DetailsAccordionMenu.CLASS.IS_OPEN);
    }, 0);
  }
}

/* インスタンスの一括生成処理
  ------------------------------------------*/
const initDetailsAccordionMenu = () => {
  const targetElements = [...document.querySelectorAll(`.${DetailsAccordionMenu.CLASS.TARGET}`)];
  if (!targetElements.length) return null;
  const instances = targetElements.map((element) => {
    try {
      return new DetailsAccordionMenu(element);
    } catch (error) {
      console.error(`[${DetailsAccordionMenu.name}]インスタンスの生成に失敗しました:${error.message}`);
      return null;
    }
  });
  return instances;
};

/* ▲ ここまでスクリプトの処理 ▲
 運用する場合はこれより上のコードをコピーし、以下のように実行してください。
*/
const myInstances = {};

const initAll = () => {
  myInstances.accordion = initDetailsAccordionMenu();
};

initAll();
