# Copyright Krafter SAS <hey@krafter.io>
# Krafter LGPL-3 License (see LICENSE file).

{
    'name': 'Minimal Backend Theme',
    'category': 'Hidden/Tools',
    'license': 'LGPL-3',
    'description': 'Extend Web Interface of Odoo CE.',
    'version': '1.0',
    'author': 'Krafter SAS',
    'maintainer': [
        'Krafter SAS',
    ],
    'website': 'https://krafter.io',
    'auto_install': [
        'web',
    ],
    'depends': [
        'base',
        'web',
    ],
    'assets': {
        'web._assets_primary_variables': [
            ('before', 'web/static/src/scss/primary_variables.scss', 'minimal_backend_theme/static/src/scss/primary_variables.scss'),
            ('before', 'web/static/src/**/*.variables.scss', 'minimal_backend_theme/static/src/**/*.variables.scss'),
        ],
        'web.assets_backend': [
            'minimal_backend_theme/static/src/components/**/*',
            'minimal_backend_theme/static/src/webclient/**/*',
        ],
    },
}
