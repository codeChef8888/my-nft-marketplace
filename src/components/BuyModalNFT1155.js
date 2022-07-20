import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
class Modal extends Component {

  render() {
    return this.props.isShowing ? ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal">
            <div className="modal-header">
              <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={this.props.toggle}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">

              <form className='mb-3'
                onSubmit={(event) => {
                  event.preventDefault();
                  let amount;
                  amount = this.input.value.toString();
                  console.log([amount, this.props.item], "ImonFire");
                  this.props.buyMarketNFT1155(this.props.item, amount);
                }}>
                <div style={{ borderSpacing: '0 1em' }}>
                  <label className='float-left' style={{ marginLeft: '15px' }}><b>Amount of {this.props.item.name}</b></label>
                  <div className='input-group mb-4'>
                    <input
                      ref={(input) => { this.input = input }}
                      type='text'
                      placeholder='0'
                      required />
                  </div>
                  <Button type='submit' className='btn btn-primary btn-lg btn-block'>Buy for {this.props.web3.utils.fromWei(this.props.item.price, 'ether')} ETH per NFT1155</Button>
                </div>
              </form>

            </div>
          </div>
        </div>

      </React.Fragment>, document.body
    ) : null;
  }
}

export default Modal;