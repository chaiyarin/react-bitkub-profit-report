import { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format'

function App() {

  const [price, setPrice] = new useState({})
  const [myMoney, setMyMoney] = new useState({ invest_money: 0, profit_money: 0 })
  const [myCryptos, setMyCrypto] = new useState(
    [
      {
        id: 1,
        price: 529.99,
        unit: 17.731
      },
      {
        id: 2,
        price: 529.98,
        unit: 75.285
      },
      {
        id: 3,
        price: 503.46,
        unit: 15.850
      },
      {
        id: 4,
        price: 503.42,
        unit: 19.814
      },
    ]
  )

  useEffect(async () => {
    await fetchPrice()
  }, [])

  const calculateInvestMoney = () => {
    let investMoney = 0;
    for (let index = 0; index < myCryptos.length; index++) {
      investMoney = (myCryptos[index].price * myCryptos[index].unit) + investMoney;
    }
    return investMoney
  }

  const calculateProfit = (price) => {
    let profitMoney = 0;
    for (let index = 0; index < myCryptos.length; index++) {
      profitMoney = ((myCryptos[index].unit * price) - (myCryptos[index].unit * myCryptos[index].price)) + profitMoney
    }
    return profitMoney
  }

  const fetchPrice = async () => {
    const res = await fetch('https://api.bitkub.com/api/market/ticker?sym=THB_DOT')
    const data = await res.json()
    setPrice(data.THB_DOT)
    const investMoney = calculateInvestMoney()
    const profitMoney = calculateProfit(data.THB_DOT.last)
    setMyMoney({ invest_money: investMoney, profit_money: profitMoney })
  }

  return (
    <>
      <div>ราคา dot ปัจุบัน : {price && price.last}</div>
      <table border="1" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th scope="col">ชื่อเหรียญ</th>
            <th scope="col">ราคาเหรียญปัจจุบัน</th>
            <th scope="col">ราคาที่ซื้อ</th>
            <th scope="col">จำนวนเหรียญที่ได้</th>
            <th scope="col">ต้นทุน</th>
            <th scope="col">กำไร/ขาดทุน</th>
          </tr>
        </thead>
        <tbody>
          {myCryptos.map((crypto, index) => {
            return (
              <tr key={crypto.id}>
                <td>Pokadot</td>
                <td>{price && price.last}</td>
                <td>{crypto.price}</td>
                <td>{crypto.unit}</td>
                <td> <NumberFormat value={crypto.unit * crypto.price} displayType={'text'} thousandSeparator={true}></NumberFormat></td>
                <td> <NumberFormat value={(price.last === null || price.last === undefined) ? 'รอคำนวน' : (crypto.unit * price.last) - (crypto.unit * crypto.price)} displayType={'text'} thousandSeparator={true}></NumberFormat></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <table border="1" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>หัวข้อ</th>
            <th>จำนวนเงิน</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>จำนวนเงินลงทุน</td>
            <td><NumberFormat value={myMoney.invest_money} displayType={'text'} thousandSeparator={true}></NumberFormat></td>
          </tr>
          <tr>
            <td>กำไร/ขาดทุน รวมทั้งสิ้น</td>
            <td><NumberFormat value={myMoney.profit_money} displayType={'text'} thousandSeparator={true}></NumberFormat></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default App;
