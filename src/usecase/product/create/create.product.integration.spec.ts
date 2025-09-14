import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test create product use case", () => {
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

	it("should create a product", async () => {
		const productRepository = new ProductRepository();
		const usecase = new CreateProductUseCase(productRepository);

		const input = {
			type: "a",
			name: "Product 1",
			price: 100,
		};

		const result = await usecase.execute(input);

		expect(result).toHaveProperty("id");
		expect(result.name).toEqual(input.name);
		expect(result.price).toEqual(input.price);
	});

	it("should thrown an error when type is invalid", async () => {
		const productRepository = new ProductRepository();
		const usecase = new CreateProductUseCase(productRepository);

		const input = {
			type: "c",
			name: "Product 1",
			price: 100,
		};

		await expect(usecase.execute(input)).rejects.toThrow(
			"Product type not supported"
		);
	});

	it("should thrown an error when name is missing", async () => {
		const productRepository = new ProductRepository();
		const usecase = new CreateProductUseCase(productRepository);

		const input = {
			type: "a",
			name: "",
			price: 100,
		};

		await expect(usecase.execute(input)).rejects.toThrow(
			"product: Name is required"
		);
	});

	it("should thrown an error when price is missing", async () => {
		const productRepository = new ProductRepository();
		const usecase = new CreateProductUseCase(productRepository);

		const input = {
			type: "a",
			name: "Product 1",
			price: 0,
		};

		await expect(usecase.execute(input)).rejects.toThrow(
			"Price must be greater than zero"
		);
	});
});
