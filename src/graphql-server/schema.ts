import {
  intArg,
  makeSchema,
  objectType,
  asNexusMethod,
  nonNull,
  stringArg,
} from "nexus";
import { DateTimeResolver } from "graphql-scalars";
import { Context } from "./context";
import path from "path";
import { Task, SubTask } from "nexus-prisma";

export const DateTime = asNexusMethod(DateTimeResolver, "date");
export const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("getTask", {
      type: "Task",
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_parent, args, ctx: Context) => {
        return ctx.prisma.task.findUnique({
          where: { id: args.id },
        });
      },
    });
    t.list.nonNull.field("getAllTasks", {
      type: "Task",
      resolve: (_parent, __, ctx: Context) => {
        return ctx.prisma.task.findMany();
      },
    });
  },
});
export const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.nonNull.field("createTask", {
      type: "Task",
      args: {
        title: nonNull(stringArg()),
        description: stringArg(),
        status: nonNull(stringArg()),
      },
      resolve: (_, args, ctx: Context) => {
        return ctx.prisma.task.create({
          data: {
            title: args.title,
            description: args.description,
            status: args.status,
          },
        });
      },
    });
    t.field("deleteTask", {
      type: "Task",
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_parent, args, ctx: Context) => {
        return ctx.prisma.task.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("createSubtask", {
      type: "SubTask",
      args: {
        taskId: nonNull(intArg()),
        body: nonNull(stringArg()),
      },
      resolve: (_, args, ctx: Context) => {
        return ctx.prisma.subTask.create({
          data: {
            body: args.body,
            taskId: args.taskId,
          },
        });
      },
    });
    t.field("deleteSubTask", {
      type: "SubTask",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, args, ctx: Context) => {
        return ctx.prisma.subTask.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("changeTaskStatus", {
      type: "Task",
      args: {
        id: nonNull(intArg()),
        status: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx: Context) => {
        const task = await ctx.prisma.task.update({
          where: {
            id: args.id,
          },
          data: {
            status: args.status,
          },
        });
        return task;
      },
    });
  },
});

export const schema = makeSchema({
  types: [
    DateTime,
    Query,
    Mutation,
    objectType({
      name: SubTask.$name,
      description: SubTask.$description,
      definition(t) {
        t.nonNull.field(SubTask.id);
        t.nonNull.field(SubTask.body);
        t.nonNull.field(SubTask.createdAt);
        t.nonNull.field(SubTask.taskId);
      },
    }),
    objectType({
      name: Task.$name,
      description: Task.$description,
      definition(t) {
        t.nonNull.field(Task.id);
        t.nonNull.field(Task.title);
        t.field(Task.description);
        t.nonNull.field(Task.status);
        t.nonNull.field(Task.createdAt);
        t.nonNull.field(Task.subTasks);
      },
    }),
  ],
  outputs: {
    schema: path.join(process.cwd(), "src", "graphql-server", "schema.graphql"),
    typegen: path.join(process.cwd(), "src", "graphql-server", "types.ts"),
  },
  contextType: {
    module: path.join(process.cwd(), "src", "graphql-server", "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
