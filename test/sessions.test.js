import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../src/app.js";

const expect = chai.expect;

chai.use(chaiHttp);

describe('Sessions API', () => {
    describe('GET /api/sessions/show', () => {
        it('should return status 200 and session data', (done) => {
            chai.request(app)
                .get('/api/sessions/show')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });
});