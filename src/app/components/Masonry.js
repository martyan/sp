import { Masonry } from 'masonic'

const EasyMasonryComponent = ({ items }) => (
    <Masonry
        items={items}
        columnGutter={10}
        columnCount={2}
    >
        {({ index, data, width }) => (
            <div style={{background: '#ff0099', padding: '10px', minHeight: `${data.size}px`}}>
                <div>Index: {index}</div>
                <pre>{JSON.stringify(data)}</pre>
                <div>Column width: {width}</div>
            </div>
        )}
    </Masonry>
)

export default EasyMasonryComponent
