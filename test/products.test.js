import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/app.js";

const expect = chai.expect;

chai.use(chaiHttp);

describe('Products Router', () => {
    it('should return all products', (done) => {
        chai.request(app)
            .get('/api/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
        });
});