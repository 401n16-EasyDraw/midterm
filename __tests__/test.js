const WS = require('jest-websocket-mock');
const ioBack = require('socket.io');
const io = require('socket.io-client');
const http = require('http');


let socket;
let httpServer;
let httpServerAddr;
let ioServer;

/**
 * Setup WS & HTTP servers
 */
beforeAll((done) => {
  httpServer = http.createServer().listen();
  httpServerAddr = httpServer.listen().address();
  ioServer = ioBack(httpServer);
  done();
});

/**
 *  Cleanup WS & HTTP servers
 */
afterAll((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

/**
 * Run before each test
 */
beforeEach((done) => {
  // Setup
  socket = io.connect(`http://localhost:3000`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  socket.on('connect', () => {
    done();
  });
});

/**
 * Run after each test
 */
afterEach((done) => {
  // Cleanup
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});


describe('basic socket.io example', () => {
  test('should communicate', (done) => {
    ioServer.emit('echo', 'Hello World');
    socket.once('echo', (message) => {
      expect(message).toBe('Hello World');
      done();
    });
    ioServer.on('connection', (mySocket) => {
      expect(mySocket).toBeDefined();
    });
  });
  test('should communicate with waiting for socket.io handshakes', (done) => {
    socket.emit('examlpe', 'some messages');
    setTimeout(() => {
      done();
    }, 50);
  });
});

test("the server keeps track of received messages, and yields them as they come in", async () => {
  const server = new WS("ws://localhost:3000");
  const client = new WebSocket("ws://localhost:3000");
 
  await server.connected;
  client.send("test");
  await expect(server).toReceiveMessage("test");
  expect(server).toHaveReceivedMessages(["test"]);
});

test("test to connected clients", async () => {
  const server = new WS("ws://localhost:3000");
  const client1 = new WebSocket("ws://localhost:3000");
  await server.connected;
  const client2 = new WebSocket("ws://localhost:3000");
  await server.connected;
 
  const messages = { client1: [], client2: [] };
  client1.onmessage = e => {
    messages.client1.push(e.data);
  };
  client2.onmessage = e => {
    messages.client2.push(e.data);
  };
 
  server.send("To all clients");
  expect(messages).toEqual({
    client1: ["To all clients"],
    client2: ["To all clients"],
  });
});