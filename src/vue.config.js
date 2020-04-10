const webpack = require('webpack')
module.exports = {
    lintOnSave: false,
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
            })
        ]
    }
}