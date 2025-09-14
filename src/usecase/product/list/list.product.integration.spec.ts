import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";

describe("Test list product use case", () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
			sync: { force: true },
		});

		await sequelize.addModels([ProductModel]);
		await sequelize.sync();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it("should list products", async () => {
		const productRepository = new ProductRepository();
		const usecase = new ListProductUseCase(productRepository);

		const product = new Product("123", "Product 1", 100);
		const product2 = new Product("456", "Product 2", 200);

		await productRepository.create(product);
		await productRepository.create(product2);

		const output = {
			"products": [{
				id: "123",
				name: "Product 1",
				price: 100,
			}, {
				id: "456",
				name: "Product 2",
				price: 200,
			}]
		};

		const result = await usecase.execute({});

		expect(result.products.length).toBe(2);
		expect(result.products[0].id).toBe(output.products[0].id);
		expect(result.products[0].name).toBe(output.products[0].name);
		expect(result.products[0].price).toBe(output.products[0].price);
		expect(result.products[1].id).toBe(output.products[1].id);
		expect(result.products[1].name).toBe(output.products[1].name);
		expect(result.products[1].price).toBe(output.products[1].price);
	});
});
