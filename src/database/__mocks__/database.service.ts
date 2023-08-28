export const DatabaseService = jest.fn().mockReturnValue({
   db: {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),

      from: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),

      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      prepare: jest.fn().mockReturnThis(),

      innerJoin: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      rightJoin: jest.fn().mockReturnThis(),
      fullJoin: jest.fn().mockReturnThis(),

      transaction: jest.fn(),
      get: jest.fn(),
      run: jest.fn(),
      all: jest.fn()
   }
});
