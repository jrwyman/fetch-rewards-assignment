const request = require('supertest');
const app = require('../server/server.js');

describe('Test API Routes', () => {
  it('should return the given transaction when added to the transactions pool', async () => {
    const res = await request(app)
      .post('/transaction')
      .send({ payer: 'MICROSOFT', points: 9999, timestamp: '2020-11-02T13:00:00Z' });
    expect(res.body).toEqual({ payer: 'MICROSOFT', points: 9999, timestamp: '2020-11-02T13:00:00Z' });
  });

  it('should return the updated transactions pool after adding points from MICROSOFT', async () => {
    const res = await request(app)
      .get('/transactions');
    expect(res.body).toEqual([{ payer: 'DANNON', points: 1000, timestamp: '2020-11-02T14:00:00Z' }, { payer: 'UNILEVER', points: 200, timestamp: '2020-10-31T11:00:00Z' }, { payer: 'DANNON', points: -200, timestamp: '2020-10-31T15:00:00Z' }, { payer: 'MILLER COORS', points: 10000, timestamp: '2020-11-01T14:00:00Z' }, { payer: 'DANNON', points: 300, timestamp: '2020-10-31T10:00:00Z' }, { payer: 'MICROSOFT', points: 9999, timestamp: '2020-11-02T13:00:00Z' }]);
  });

  it('should get the balance of points separated by payer', async () => {
    const res = await request(app)
      .get('/balance');
    expect(res.body).toEqual({ DANNON: 1100, UNILEVER: 200, 'MILLER COORS': 10000, MICROSOFT: 9999 });
  });

  it('should spend 5000 points and return a list of points deducted by payer', async () => {
    const res = await request(app)
      .post('/spend')
      .send({ points: 5000 });
    expect(res.body).toEqual([{ payer: 'DANNON', points: -100 }, { payer: 'UNILEVER', points: -200 }, { payer: 'MILLER COORS', points: -4700 }]);
  });

  it('should get the updated balance of points by payer after spending 5000 points', async () => {
    const res = await request(app)
      .get('/balance');
    expect(res.body).toEqual({ DANNON: 1000, UNILEVER: 0, 'MILLER COORS': 5300, MICROSOFT: 9999 });
  });
});
