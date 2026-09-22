syn({
    console: syn.req('data.text'),
    view: [
        { b: 0x777777ff, c: 0x00aaffff, y: 0 },
        [{ b: 0x555555ff, c: 0x00aaffff }, 'Header'],
        ['Body'],
        [{ b: 0x555555ff, c: 0x00aaffff }, 'Footer']
    ]
})