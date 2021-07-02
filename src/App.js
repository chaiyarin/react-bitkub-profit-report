import { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { Helmet } from 'react-helmet'

function App() {

  const [price, setPrice] = new useState({})
  const [myMoney, setMyMoney] = new useState({ invest_money: 0, profit_money: 0 })
  const [priceSell, setPriceSell] = new useState(0)
  const [profitWant, setProfitWant] = new useState(0)
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
      {
        id: 5,
        price: 480,
        unit: 15.58593
      }
    ]
  )

  useEffect(async () => {
    fetchPrice()
    const interval = setInterval(async () => {
      await fetchPrice()
    }, 10000);
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
    const res = await fetch('https://api.bitkub.com/api/market/ticker?sym=THB_DOT', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    const data = await res.json()
    setPrice(data.THB_DOT)
    const investMoney = calculateInvestMoney()
    const profitMoney = calculateProfit(data.THB_DOT.last)
    setMyMoney({ invest_money: investMoney, profit_money: profitMoney })
  }

  const calculatePriceSell = (profitInput) => {
    if (profitInput === '') {
      setPriceSell(0)
      return;
    }
    let allUnit = 0;
    for (let index = 0; index < myCryptos.length; index++) {
      allUnit = myCryptos[index].unit + allUnit
    }
    const priceSellTemp = (myMoney.invest_money + parseInt(profitInput)) / allUnit
    setPriceSell(priceSellTemp)
  }

  const calculateCoinPrice = (priceSellTemp) => {
    if (priceSellTemp === '') {
      setProfitWant(0)
      return;
    }
    let allUnit = 0;
    for (let index = 0; index < myCryptos.length; index++) {
      allUnit = myCryptos[index].unit + allUnit
    }

    const profitTemp = (priceSellTemp * allUnit) - myMoney.invest_money

    setProfitWant(profitTemp)
  }

  return (
    <>
      <h1>ราคา dot ปัจุบัน : <div style={{ fontSize: '10vh' }}>{price && price.last} </div></h1>
      <h1>กำไร / ขาดทุน :  <div style={myMoney.profit_money < 0 ? { color: 'red', fontSize: '10vh' } : { color: 'green', fontSize: '10vh' }}>
        <NumberFormat value={myMoney.profit_money.toFixed(2)} displayType={'text'} thousandSeparator={true}></NumberFormat>
      </div>
      </h1>
      <Helmet>
        <meta charSet="utf-8" />
        <title>DOT: {(price.last === null || price.last === undefined) ? 'รอโหลด' : price.last + ''}</title>
      </Helmet>
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
                <td> <NumberFormat value={(crypto.unit * crypto.price).toFixed(2)} displayType={'text'} thousandSeparator={true}></NumberFormat></td>
                <td style={((crypto.unit * price.last) - (crypto.unit * crypto.price)) < 0 ? { backgroundColor: 'red', color: 'white' } : { backgroundColor: 'green', color: 'white' }}> <NumberFormat value={(price.last === null || price.last === undefined) ? 'รอคำนวน' : ((crypto.unit * price.last) - (crypto.unit * crypto.price)).toFixed(2)} displayType={'text'} thousandSeparator={true}></NumberFormat></td>
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
            <td><NumberFormat value={myMoney.invest_money.toFixed(2)} displayType={'text'} thousandSeparator={true}></NumberFormat></td>
          </tr>
          <tr>
            <td>กำไร/ขาดทุน รวมทั้งสิ้น</td>
            <td style={myMoney.profit_money < 0 ? { backgroundColor: 'red', color: 'white' } : { backgroundColor: 'green', color: 'white' }}><NumberFormat value={myMoney.profit_money.toFixed(2)} displayType={'text'} thousandSeparator={true}></NumberFormat></td>
          </tr>
        </tbody>
      </table>
      <table border='1' style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>หัวข้อ</th>
            <th>ช่องกรอก</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>กำไรที่อยากได้</td>
            <td><input type="number" onChange={(e) => calculatePriceSell(e.target.value)} /> </td>
          </tr>
          <tr>
            <td>ต้องขายที่ราคา</td>
            <td>{priceSell}</td>
          </tr>
        </tbody>
      </table>

      <table border='1' style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>หัวข้อ</th>
            <th>ช่องกรอก</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ราคาขาย</td>
            <td><input type="number" onChange={(e) => calculateCoinPrice(e.target.value)} /> </td>
          </tr>
          <tr>
            <td>กำไรที่ได้</td>
            <td>{profitWant}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default App;
