// import React, { Component } from 'react';
// import { Row, Col, Card, Button } from 'react-bootstrap'




// class Home extends Component{
    
// render (){

//    return (
//         <div className="flex justify-center">
//             {this.props.items.length > 0 ?
//                 <div className="px-5 container">
//                     <Row xs={1} md={2} lg={4} className="g-4 py-5">
//                         {this.props.items.map((item, idx) => (
//                             <Col key={idx} className="overflow-hidden">
//                                 <Card>
//                                     <Card.Img variant="top" src={item.image} />
//                                     <Card.Body color="secondary">
//                                         <Card.Title>{item.name}</Card.Title>
//                                         <Card.Text>
//                                             {item.description}
//                                         </Card.Text>
//                                     </Card.Body>
//                                     <Card.Footer>
//                                         <div className='d-grid'>
//                                             <Button onClick={() => this.props.buyNFT(item)} variant="primary" size="lg">
//                                                 Buy for {window.web3.utils.toWei(item.totalPrice, 'ether')} ETH
//                                             </Button>
//                                         </div>
//                                     </Card.Footer>
//                                 </Card>
//                             </Col>
//                         ))}
//                     </Row>
//                 </div>
//                 : (
//                     <main style={{ padding: "1rem 0" }}>
//                         <h2>No listed assets</h2>
//                     </main>
//                 )}
//         </div>
//     );
// } 
// }

// export default Home;
