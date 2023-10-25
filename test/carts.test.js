import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/app.js";

const expect = chai.expect;

chai.use(chaiHttp);

describe('Carts Router', () => {
    describe('GET /api/carts', () => {
        it('should create a new cart', (done) => {
            chai.request(app)
                .post('/api/carts')
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('_id');
                    done();
                });
        });
    });
});