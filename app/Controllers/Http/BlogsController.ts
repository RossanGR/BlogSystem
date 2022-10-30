import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {v4 as uuidv4} from 'uuid';

import Blog from 'App/Models/Blog';

import  Application  from '@ioc:Adonis/Core/Application';


export default class BlogsController {

    private validationOptions = {
        types: ['image'],
        size: '3mb'
    }


    // Função para criar um artigo
    public async store({request, response}:HttpContextContract){

        const body = request.body()

        const image = request.file('image', this.validationOptions)
        
        if(image){
            const imageName = `${uuidv4()}.${image.extname}`;

            await image.move(Application.tmpPath('uploads'),{
                name: imageName
            })

            body.image = imageName;
        
        }


        const blogs = await Blog.create(body);

        response.status(201)

        return{
            message: 'Blog Criado com sucesso!',
            data: blogs
        }
     
    }

    // Função para buscar todos os artigos
    public async index(){
        const blogs = await Blog.all();

        return {blogs}
    }

    // Função para buscar um artigo específico
    public async show({params} : HttpContextContract){
        const blogs = await Blog.findOrFail(params.id);

        return{
            data: blogs
        }
    }

    // Função para deletar um artigo específico
    public async destroy({params} : HttpContextContract){
        
        const blogs = await Blog.findOrFail(params.id);
        await blogs.delete()

        return{
            message: 'Blog excluido com sucesso!',
            data: blogs
        }
    }

    // Função para atulizar um artigo específico
    public async update({params, request}: HttpContextContract){
        const body = request.body();

        const blog = await Blog.findOrFail(params.id)

        blog.title = body.title;
        blog.content = body.content

        if(blog.image != body.image || !body.image){
            const image = request.file('image', this.validationOptions);

            if(image){
                const imageName = `${uuidv4()}.${image.extname}`;

                await image.move(Application.tmpPath('uploads'),{
                    name: imageName
                })

                body.image = imageName;
            }
        }

        await blog.save();
        return{
            message: 'Blog Atualizado com sucesso',
            data: body
        }
    }
}
