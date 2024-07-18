import { defineComponent, h, type CSSProperties } from 'vue'

export default defineComponent(
  ({ count }) => {
    const style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      minHeight: '39px',
      minWidth: '83px',
      backgroundImage:
        'url(https://a.amap.com/jsapi_demos/static/demo-center/marker/express2.png)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    } as CSSProperties

    return () => h('div', { style }, count)
  },
  {
    props: {
      count: Number
    }
  }
)
