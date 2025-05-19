# Copyright Krafter SAS <hey@krafter.io>
# Krafter Proprietary License (see LICENSE file).

from odoo import fields, models


class IrUiMenu(models.Model):
    _inherit = 'ir.ui.menu'

    font_icon = fields.Char('Font icon')
    font_icon_color = fields.Char('Font icon color')

    position = fields.Selection(
        [
            ('system_tray', 'System Tray'),
        ],
        'Position',
    )

    def write(self, vals):
        res = super().write(vals)

        for item in self:
            # Force remove menu position value if menu item is a sub menu item
            if item.parent_id and item.position:
                item.position = False

        return res

    def load_web_menus(self, debug):
        menus = super().load_web_menus(debug)

        ids = list(menus.keys())
        ids.remove('root')

        # Inject extra values in menu items
        menu_values = self.search_read([('id', 'in', ids)], fields=self.get_extra_fields())

        for menu_value in menu_values:
            vals = {}
            self.inject_extra_fields(menu_value, vals)

            if vals:
                menus.get(menu_value.get('id')).update(vals)

        return menus

    def get_extra_fields(self):
        return [
            'id',
            'parent_path',
            'position',
            'font_icon',
            'font_icon_color',
        ]

    def inject_extra_fields(self, menu_value, vals):
        position = menu_value.get('position')
        parent_path = [int(x) for x in menu_value.get('parent_path').split('/') if x]

        if position:
            vals['position'] = position

        if parent_path:
            vals['parentPath'] = parent_path

        if menu_value.get('font_icon'):
            vals['fontIcon'] = menu_value.get('font_icon')

        if menu_value.get('font_icon_color'):
            vals['fontIconColor'] = menu_value.get('font_icon_color')
