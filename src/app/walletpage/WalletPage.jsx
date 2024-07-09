import './WalletPage.scss'
import {Component} from "react";
import defaultProfileImage from "../../assets/defaultProfileImage.png"
import settingsGear from "../../assets/settingsGear.svg"
import {Link} from "react-router-dom";
import {formatMoney} from "../utils.jsx";

export default class WalletPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <>
      <div className="top-bar">
        <img src={defaultProfileImage} alt="Profile"/>
        <h3>Bob Dylan</h3>
        <Link className={"material-symbols-rounded settings-gear"} to="/app/settings">
          Settings
        </Link>
      </div>

      <div className="balance-container">
        <h2>$30.52</h2>
      </div>
      <div className="transactions">
        {this.props.database.getTransactions(true).map(transaction => <Transaction key={transaction.id} {...transaction} />)}
        {this.props.database.getTransactions(true).map(transaction => <Transaction key={transaction.id} {...transaction} />)}
        {this.props.database.getTransactions(true).map(transaction => <Transaction key={transaction.id} {...transaction} />)}
      </div>
    </>;
  }
}

function Transaction({amount, isDeposit, name}) {
  return <div className="transaction-container">
    <p>{name}</p>
    <h2>{isDeposit ? '+' : '-'}${formatMoney(amount)}</h2>
  </div>
}