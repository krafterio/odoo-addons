/** @odoo-module **/

import {useState} from '@odoo/owl';
import {useService} from '@web/core/utils/hooks';
import {NavBar} from '@web/webclient/navbar/navbar';
import {patch} from '@web/core/utils/patch';
import {_t} from '@web/core/l10n/translation';

patch(NavBar.prototype, {
    setup() {
        super.setup?.();
        this.menuStateService = useState(useService('menu_state'));
    },

    get systemTrayItems() {
        const menu = this.menuService.getMenuAsTree('root');
        const items = [];

        (menu.childrenTree || []).forEach((menu) => {
            if ('system_tray' === menu.position) {
                items.push({
                    ...menu,
                    isActive: this.menuStateService.menuIsActivated(menu),
                });
            }
        });

        return items;
    },

    get rootMainCategoryAppSections() {
        const rootMenu = this.menuService.getMenuAsTree('root');
        const menus = rootMenu.childrenTree || [];

        const categories = {};

        menus.forEach((menu) => {
            if (menu.position) {
                return;
            }

            const menuCatId = menu.category ? menu.category[0] : undefined;
            const menuCatName = menu.category ? menu.category[1] : undefined;
            const menuCatSeq = menu.categorySequence ? menu.categorySequence : undefined;

            if (undefined === categories[menuCatId]) {
                categories[menuCatId] = {
                    display_name: menuCatName || _t('Other'),
                    sequence: menuCatSeq,
                    value: menuCatId || 0,
                    menus: [],
                }
            }

            categories[menuCatId]['menus'].push(menu);
        });

        const categoryList = Object.keys(categories).map(key => categories[key]);
        categoryList.sort((a, b) => {
            if (a.sequence === undefined) {
                return 1;
            }

            if (b.sequence === undefined) {
                return -1;
            }

            return a.sequence - b.sequence;
        });

        return categoryList;
    },

    get rootMainAppSections() {
        const menus = [];

        this.rootMainCategoryAppSections.forEach((category) => {
            category.menus.forEach((menu) => {
                const newMenu = {...menu};
                newMenu.childrenTree = [];
                menus.push(newMenu);
            });
        });

        return menus;
    },

    onNavBarDropdownItemSelection(menu) {
        super.onNavBarDropdownItemSelection(menu);

        // Force app changed to refresh the selection of menu
        if (menu) {
            this.env.bus.trigger('MENUS:APP-CHANGED');
        }
    },

    sectionIsSelected(menu) {
        if (this.currentApp && menu) {
            menu = typeof menu === 'number' ? this.menuService.getMenu(menu) : menu;

            // Check if selected menu is in sub menu or in children
            if (this.menuStateService.menuIsActivated(menu)) {
                return true;
            }

            // Check if selected menu is currentApp and if it is the case, check if the first sub menu is the same menu
            const currentApp = this.menuService.getCurrentApp();

            return currentApp.id === this.menuStateService.currentMenuId && currentApp?.childrenTree[0]?.id === menu.id;
        }

        return false;
    },
});
