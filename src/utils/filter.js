import Vue from 'vue'
const conditions = [{
        value: 1,
        label: '等于'
    },
    {
        value: 2,
        label: '不等于'
    },
    {
        value: 3,
        label: '大于'
    },
    {
        value: 4,
        label: '大于等于'
    },
    {
        value: 5,
        label: '小于'
    },
    {
        value: 6,
        label: '小于等于'
    },
    {
        value: 7,
        label: '包含'
    },
    {
        value: 8,
        label: '不包含'
    },
    {
        value: 9,
        label: '属于实体'
    },
    {
        value: 10,
        label: '不属于实体'
    },
    {
        value: 11,
        label: '符合正则'
    },
    {
        value: 12,
        label: '不符合正则'
    },
    {
        value: 13,
        label: '不满足条件'
    },
    {
        value: 500,
        label: '异常'
    },
    {
        value: 200,
        label: '有结果'
    },
    {
        value: 201,
        label: '无结果'
    }
]
Vue.filter('setRuleEnumCode', (code) => {
    const temp = conditions.filter((item) => {
        return item.value === code
    })
    console.log(code, temp, 1111)

    return temp[0].label
})