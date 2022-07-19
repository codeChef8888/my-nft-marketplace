import React, { Component } from 'react';
import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from '../nft.png';

class Navigation extends Component {
    render() {
        return (
            <Navbar expand="lg" bg="secondary" variant="dark">
                <Container>
                    <Navbar.Brand href="">
                        <img src={market} width="40" height="40" className="" alt="" />
                        &nbsp; My NFT Marketplace
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/createNFT">Create ERC721</Nav.Link>
                            <Nav.Link as={Link} to="/createNFT1155">Create ERC1155</Nav.Link>
                            <Nav.Link as={Link} to="/my-listed-nfts">My Listed Items</Nav.Link>
                            <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                        </Nav>
                        <Nav>
                            {this.props.account ? (
                                <Nav.Link
                                    href={`https://etherscan.io/address/${this.props.account}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="button nav-button btn-sm mx-4">
                                    <Button variant="outline-light">
                                        {this.props.account.slice(0, 5) + '...' + this.props.account.slice(38, 42)}
                                    </Button>

                                </Nav.Link>
                            ) : (
                                <Button onClick={(event) => {
                                    event.preventDefault();

                                }} variant="outline-light">Connect Wallet</Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )

    }

}

export default Navigation;